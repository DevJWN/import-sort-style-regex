import { IImport } from "import-sort-parser";
import { IMatcherFunction, IStyleAPI, IStyleItem } from "import-sort-style";

interface Options {
  groups: string[][];
}

const defaultGroups = [["^@\\w", "^\\w"], ["^\\.\\./", "^\\./"], ["\\.s?css$"]];

export default function Index(styleApi: IStyleAPI, _file: string, options?: Options): IStyleItem[] {
  const groups = options && options.groups ? options.groups : defaultGroups;

  const {
    and,
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
          { match: and(match, hasNamespaceMember) },
          { match: and(match, hasDefaultMember) },
          { match: and(match, hasNamedMembers) },
        ];
      }),
      { separator: true },
    ];
  });
}
