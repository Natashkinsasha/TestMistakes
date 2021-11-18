module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",

    "parserOptions": {
        "ecmaVersion": 2020,
        "project": "./tsconfig.json"
    },
    "settings": {
        "import/resolver": {
            "node": {
                "extensions": [".js", ".jsx", ".ts", ".tsx"]
            }
        }
    },
    plugins: [
        "@typescript-eslint",
        "mocha",
        "import",
        "filenames",
        "prettier",
        "mocha"
    ],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:node/recommended",
        "plugin:import/recommended",
        "prettier",
        "plugin:mocha/recommended"
    ],
    rules: {
        "node/no-unsupported-features/es-syntax": ["error", { "ignores": ["modules"] }],
        "@typescript-eslint/no-explicit-any": 0,
        "node/no-missing-import": 0,
        "filenames/match-exported": 2,
        "prettier/prettier": "error",
        "@typescript-eslint/no-unused-vars": "off",
        "mocha/no-skipped-tests": "off",
    },
    ignorePatterns: ['*.d.ts'],
};