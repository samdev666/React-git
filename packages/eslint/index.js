module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    "eslint:recommended",
    'plugin:react/recommended',
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    'airbnb',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    "max-len": "off" ,
    "react/jsx-filename-extension": [1, {
      "extensions": [".ts", ".tsx", ".js", ".jsx"]
    }],
    "react/function-component-definition": [
      "error",
      {
        "namedComponents": "arrow-function",
        "unnamedComponents": "arrow-function"
      }
    ],
    "no-undef": "off",
    "no-shadow": ["off"],
    "no-unused-expressions": [2, { allowTernary: true }],
    "jsx-a11y/label-has-associated-control": [ "error", {
      "required": {
        "some": [ "nesting", "id"  ]
      }
    }],
    "jsx-a11y/label-has-for": [ "error", {
      "required": {
        "some": [ "nesting", "id"  ]
      }
    }],
    "react/require-default-props": "off",
    "react/jsx-props-no-spreading":"off",
    "react/prop-types": "off",
    'import/extensions': 'off',
    "react/no-unstable-nested-components": "off",
    "default-param-last": "off",
    "no-unused-vars": "off",
    "import/no-duplicates": "off",
    "func-names": "off",
    "global-require": "off",
    "@typescript-eslint/no-var-requires": "off",
    "no-unused-expressions": "off",
    "no-unsafe-optional-chaining": "off",
    "import/no-extraneous-dependencies": "off",
    "no-underscore-dangle": "off",
    "no-case-declarations": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "import/no-cycle": "off"
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx",".js", ".jsx"]
    },
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true
      }
    }
  }
};
