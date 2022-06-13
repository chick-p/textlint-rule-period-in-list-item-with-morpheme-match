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
  ],
});
