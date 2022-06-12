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
  ],
  invalid: [
    {
      text: `* 項目を追加します`,
      errors: [
        {
          message: `Not exist period mark("。") at end of list item.`,
          line: 1,
          column: 3,
        },
      ],
    },
    {
      text: `1. 項目を追加します`,
      errors: [
        {
          message: `Not exist period mark("。") at end of list item.`,
          line: 1,
          column: 4,
        },
      ],
    },
    {
      text: `* 項目\n* 項目です`,
      errors: [
        {
          message: `Not exist period mark("。") at end of list item.`,
          line: 2,
          column: 3,
        },
      ],
    },
    {
      text: `* 項目を追加します\n* 項目を追加します`,
      errors: [
        {
          message: `Not exist period mark("。") at end of list item.`,
          line: 1,
          column: 3,
        },
        {
          message: `Not exist period mark("。") at end of list item.`,
          line: 2,
          column: 3,
        },
      ],
    },
    {
      text: `* 項目を追加します。\n* 項目を追加します`,
      errors: [
        {
          message: `Not exist period mark("。") at end of list item.`,
          line: 2,
          column: 3,
        },
      ],
    },
  ],
});
