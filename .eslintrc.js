module.exports = {
  env: {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "node": true
  },
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
    "plugin:react/recommended",
    "prettier",
  ],
  rules: {
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-empty-function": "warn",
    "sort-imports": ["error", {
      "ignoreCase": false,
      "ignoreDeclarationSort": true,
      "ignoreMemberSort": false,
      "memberSyntaxSortOrder": ["none", "all", "multiple", "single"],
      "allowSeparatedGroups": false
    }]
  }
};
