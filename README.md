# import-sort-style-regex

Customizable style for [import-sort](https://https://github.com/renke/import-sort) using Regular Expressions.

## Get started

### **Installation**

This requires [import-sort](https://www.npmjs.com/package/import-sort) to be installed..\
Optionally works best with [prettier-plugin-import-sort](https://https://www.npmjs.com/package/prettier-plugin-import-sort).

```bash
npm install --save-dev import-sort-style-regex
```

### Customization Example

The following added to `package.json` is an example of sorting by regex groups in Typescript. Each array in _options.groups_ can contain multiple regex patterns which will appear in order. Each group is separated by an empty line.

```json
"importSort": {
  ".js, .jsx, .ts, .tsx": {
    "parser": "typescript",
    "style": "regex",
    "options": {
      "groups": [
        [
          "^react"
        ],
        [
          "^@\\w",
          "^\\w"
        ],
        [
          "^\\.\\./",
          "^\\./"
        ],
        [
          "\\.s?css$"
        ]
      ]
    }
  }
}
```
