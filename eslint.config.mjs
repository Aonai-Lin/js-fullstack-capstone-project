import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,  // 启用 Node.js 全局变量
        process: "readonly"  // 如果需要 process，可以显式声明
      },
    },
    settings: {
      react: {
        version: "detect"  // 自动检测 React 版本
      }
    },
    rules: {
      "react/prop-types": "off"  // 禁用 propTypes 检查
    }
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended
];