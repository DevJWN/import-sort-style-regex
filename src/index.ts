import type { IImport, IParserOptions } from "import-sort-parser";
import type { IMatcherFunction, ISorterFunction, IStyleAPI, IStyleItem } from "import-sort-style";

type ImportSortStyleRegexOptions = IParserOptions & {
  groups?: string[][];
  sortByMemberType?: boolean;
};

const defaultGroups = [["^@\\w", "^\\w"], ["^\\.\\./", "^\\./"], ["\\.s?css$"]];

const memberType: ISorterFunction = (i1: IImport, i2: IImport) => {
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

const ImportSortStyleRegex = (styleApi: IStyleAPI, _file: string, options?: ImportSortStyleRegexOptions): IStyleItem[] => {
  const groups = options?.groups || defaultGroups;
  const sortByMemberType = options?.sortByMemberType || false;

  const { and, unicode, moduleName, member, name, hasNoMember, isAbsoluteModule, isRelativeModule } = styleApi;

  return [
    { match: and(hasNoMember, isAbsoluteModule) },
    { separator: true },
    { match: and(hasNoMember, isRelativeModule) },
    { separator: true },

    ...groups.flatMap((group) => {
      return [
        ...group.map<IStyleItem>((regex) => {
          const regexMatch: IMatcherFunction = (i: IImport) => Boolean(new RegExp(regex).exec(i.moduleName));

          return {
            match: regexMatch,
            sort: [...(sortByMemberType ? [memberType] : []), moduleName(unicode), member(unicode)],
            sortNamedMembers: name(unicode),
          };
        }),

        { separator: true },
      ];
    }),
  ];
};

export default ImportSortStyleRegex;
