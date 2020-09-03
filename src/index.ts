import { IImport, IParserOptions } from "import-sort-parser";
import { IMatcherFunction, IStyleAPI, IStyleItem } from "import-sort-style";

const defaultGroups = [["^@\\w", "^\\w"], ["^\\.\\./", "^\\./"], ["\\.s?css$"]];

export default function Index(
  styleApi: IStyleAPI,
  _file: string,
  options?: IParserOptions & { groups: string[][] }
): IStyleItem[] {
  const groups = options && options.groups ? options.groups : defaultGroups;

  const {
    and,
    member,
    name,
    unicode,
    hasNoMember,
    hasDefaultMember,
    hasNamespaceMember,
    hasNamedMembers,
    isAbsoluteModule,
    isRelativeModule,
  } = styleApi;

  return groups.flatMap((group) => {
    return [
      { match: and(hasNoMember, isAbsoluteModule) },
      { separator: true },
      { match: and(hasNoMember, isRelativeModule) },
      { separator: true },
      ...group.flatMap((regex) => {
        const match: IMatcherFunction = (imported: IImport) => Boolean(new RegExp(regex).exec(imported.moduleName));

        return [
          { match: and(match, hasNamespaceMember), sort: member(unicode), sortNamedMembers: name(unicode) },
          { match: and(match, hasDefaultMember), sort: member(unicode), sortNamedMembers: name(unicode) },
          { match: and(match, hasNamedMembers), sort: member(unicode), sortNamedMembers: name(unicode) },
        ];
      }),
      { separator: true },
    ];
  });
}
