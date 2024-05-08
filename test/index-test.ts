import path from "path";
import TextLintTester from "textlint-tester";
import rule from "../src/index";
const tester = new TextLintTester();
// @ts-ignore
tester.run("rule", rule, {
  valid: [
    `text.`,
    {
      text: `* 項目`,
    },
    {
      text: `* 項目1\n* 項目2`,
    },
    {
      text: `* 項目1\n  説明です。`,
    },
    {
      text: `* 項目1\n  * 項目1-1`,
    },
    {
      text: "* `ITEM`：項目",
    },
    {
      text: "* `ITEM`：項目（その他）",
    },
    {
      text: "* `ITEM1`：1番目の項目\n* `ITEM2`：2番目の項目",
    },
    {
      text: `* 項目を追加します。`,
    },
    {
      text: `1. 項目を追加します。`,
    },
    {
      text: `* 項目を追加します。\n  * 項目を追加します。`,
    },
    {
      text: "* 項目には`column`を使用します。",
    },
    {
      text: "* 詳細は[column](https://example.com)を参照してください。",
    },
    {
      text: "* 詳細は**column**を参照してください。",
    },
    {
      text: "* 詳細は**太字です**。",
    },
    {
      text: "* 詳細は**太字です。**",
    },
    {
      inputPath: path.join(__dirname, "fixtures/valid/multiparagraph.md"),
    },
    {
      text: "* [リンクです](https://example.com)",
    },
    {
      text: "* これは[リンクです](https://example.com)",
    },
    {
      text: "* これは[リンクです](https://example.com)ね。",
    },
    {
      text: "* `code`",
    },
    {
      text: "* これは`code`",
    },
    {
      text: "* これは`code`ですね。",
    },
    {
      text: "* これは`code`と`code`です。",
    },
  ],
  invalid: [
    {
      text: `* 項目。`,
      errors: [
        {
          message: `Should remove period mark("。") at end of list item.`,
          line: 1,
          column: 5,
        },
      ],
    },
    {
      text: `* 項目！`,
      options: {
        periodMarks: ["！"],
      },
      errors: [
        {
          message: `Should remove period mark("！") at end of list item.`,
          line: 1,
          column: 5,
        },
      ],
    },
    {
      text: `* 項目。`,
      output: `* 項目`,
      options: {
        isRemovePeriod: true,
      },
      errors: [
        {
          message: `Should remove period mark("。") at end of list item.`,
          line: 1,
          column: 5,
        },
      ],
    },
    ,
    {
      text: `* 項目！`,
      output: `* 項目`,
      options: {
        isRemovePeriod: true,
        periodMarks: ["！"],
      },
      errors: [
        {
          message: `Should remove period mark("！") at end of list item.`,
          line: 1,
          column: 5,
        },
      ],
    },
    {
      text: `* 項目。\n* 項目。`,
      output: `* 項目\n* 項目`,
      options: {
        isRemovePeriod: true,
      },
      errors: [
        {
          message: `Should remove period mark("。") at end of list item.`,
          line: 1,
          column: 5,
        },
        {
          message: `Should remove period mark("。") at end of list item.`,
          line: 2,
          column: 5,
        },
      ],
    },
    {
      text: `* 項目を追加します`,
      errors: [
        {
          message: `Not exist period mark("。") at end of list item.`,
          line: 1,
          column: 10,
        },
      ],
    },
    {
      text: `* 項目を追加します`,
      output: `* 項目を追加します。`,
      options: {
        isAppendPeriod: true,
      },
      errors: [
        {
          message: `Not exist period mark("。") at end of list item.`,
          line: 1,
          column: 10,
        },
      ],
    },
    {
      text: `* 項目を追加します  `,
      output: `* 項目を追加します。  `,
      options: {
        isAppendPeriod: true,
      },
      errors: [
        {
          message: `Not exist period mark("。") at end of list item.`,
          line: 1,
          column: 10,
        },
      ],
    },
    {
      text: `1. 項目を追加します`,
      output: `1. 項目を追加します。`,
      options: {
        isAppendPeriod: true,
      },
      errors: [
        {
          message: `Not exist period mark("。") at end of list item.`,
          line: 1,
          column: 11,
        },
      ],
    },
    {
      text: `* 項目\n* 項目です`,
      output: `* 項目\n* 項目です。`,
      options: {
        isAppendPeriod: true,
      },
      errors: [
        {
          message: `Not exist period mark("。") at end of list item.`,
          line: 2,
          column: 6,
        },
      ],
    },
    {
      text: `* 項目を追加します\n* 項目を追加します`,
      output: `* 項目を追加します。\n* 項目を追加します。`,
      options: {
        isAppendPeriod: true,
      },
      errors: [
        {
          message: `Not exist period mark("。") at end of list item.`,
          line: 1,
          column: 10,
        },
        {
          message: `Not exist period mark("。") at end of list item.`,
          line: 2,
          column: 10,
        },
      ],
    },
    {
      text: `* 項目を追加します。\n  * 項目を追加します`,
      output: `* 項目を追加します。\n  * 項目を追加します。`,
      options: {
        isAppendPeriod: true,
      },
      errors: [
        {
          message: `Not exist period mark("。") at end of list item.`,
          line: 2,
          column: 12,
        },
      ],
    },
    {
      inputPath: path.join(__dirname, "fixtures/invalid/multiline.md"),
      output:
        "# NG\n" +
        "\n" +
        "- 項目です。  \n" +
        "  これは説明です。  \n" +
        "  これも説明です。\n" +
        "  - 項目その 2 です。\n" +
        "  - 項目その 3 です。\n" +
        "  - 項目その 4\n",
      options: {
        isAppendPeriod: true,
        isRemovePeriod: true,
      },
      errors: [
        {
          message: `Not exist period mark("。") at end of list item.`,
          line: 3,
          column: 6,
        },
        {
          message: `Not exist period mark("。") at end of list item.`,
          line: 4,
          column: 9,
        },
        {
          message: `Not exist period mark("。") at end of list item.`,
          line: 7,
          column: 13,
        },
        {
          message: `Should remove period mark("。") at end of list item.`,
          line: 8,
          column: 11,
        },
      ],
    },
    {
      text: "* 詳細は**太字です**",
      output: "* 詳細は**太字です。**",
      options: {
        isAppendPeriod: true,
      },
      errors: [
        {
          message: `Not exist period mark("。") at end of list item.`,
          line: 1,
          column: 11,
        },
      ],
    },
    {
      inputPath: path.join(__dirname, "fixtures/invalid/multiparagraph.md"),
      output:
        "# NG\n" +
        "\n" +
        "- これは1段落目です。\n" +
        "\n" +
        "  これは2段落目です。  \n" +
        "  2段目の続きです。\n",
      options: {
        isAppendPeriod: true,
      },
      errors: [
        {
          message: `Not exist period mark("。") at end of list item.`,
          line: 5,
          column: 11,
        },
      ],
    },
    {
      text: "* これは[リンクです](https://example.com)ね",
      output: "* これは[リンクです](https://example.com)ね。",
      options: {
        isAppendPeriod: true,
      },
      errors: [
        {
          message: `Not exist period mark("。") at end of list item.`,
          line: 1,
          column: 34,
        },
      ],
    },
    {
      text: "* これは`code`と`code`ですね",
      output: "* これは`code`と`code`ですね。",
      options: {
        isAppendPeriod: true,
      },
      errors: [
        {
          message: `Not exist period mark("。") at end of list item.`,
          line: 1,
          column: 21,
        },
      ],
    },
  ],
});
