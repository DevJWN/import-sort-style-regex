import { IImport, IParserOptions } from "import-sort-parser";
import { IMatcherFunction, ISorterFunction, IStyleAPI, IStyleItem } from "import-sort-style";

const defaultGroups = [["^@\\w", "^\\w"], ["^\\.\\./", "^\\./"], ["\\.s?css$"]];

const sortByMemberType: ISorterFunction = (i1: IImport, i2: IImport) => {
  const compareHasNamespaceMember = Number(!!i1.namespaceMember) - Number(!!i2.namespaceMember);
  if (compareHasNamespaceMember != 0) {
    return compareHasNamespaceMember;
  }

  const compareHasDefaultMember = Number(!!i1.defaultMember) - Number(!!i2.defaultMember);
  if (compareHasDefaultMember != 0) {
    return compareHasDefaultMember;
  }

  const compareHasNamedMembers = Number(i1.namedMembers.length > 0) - Number(i2.namedMembers.length > 0);
  return compareHasNamedMembers;
};

const Index = (styleApi: IStyleAPI, _file: string, options?: IParserOptions & { groups: string[][] }): IStyleItem[] => {
  const groups = options && options.groups ? options.groups : defaultGroups;

  const { and, unicode, moduleName, member, name, hasNoMember, isAbsoluteModule, isRelativeModule } = styleApi;

  return [
    { match: and(hasNoMember, isAbsoluteModule), separator: true },
    { match: and(hasNoMember, isRelativeModule), separator: true },
    ...groups.flatMap((group) => [
      ...group.map((regex) => {
        const match: IMatcherFunction = (i: IImport) => Boolean(new RegExp(regex).exec(i.moduleName));

        return {
          match,
          sort: [sortByMemberType, moduleName(unicode), member(unicode)],
          sortNamedMembers: name(unicode),
        };
      }),
      { separator: true },
    ]),
  ];
};

export default Index;
