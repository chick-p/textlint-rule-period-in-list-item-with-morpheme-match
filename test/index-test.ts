import TextLintTester from "textlint-tester";
import rule from "../src/index";
const tester = new TextLintTester();
// @ts-ignore
tester.run("rule", rule, {
  valid: [
    `text.`,
    {
      text: `* Item.`,
    },
    {
      text: `* Item1.\n* Item2.`,
    },
    ,
    {
      text: `* Item1.\n  * Item1-1.`,
    },
  ],
  invalid: [
    {
      text: `* Item`,
      output: `* Item.`,
      options: {
        preferPeriodMark: ".",
      },
      errors: [
        {
          message: `Not exist period mark(".") at end of list item.`,
          line: 1,
          column: 6,
        },
      ],
    },
    {
      text: `* Item1.\n* Item2`,
      output: `* Item1.\n* Item2.`,
      options: {
        preferPeriodMark: ".",
      },
      errors: [
        {
          message: `Not exist period mark(".") at end of list item.`,
          line: 2,
          column: 7,
        },
      ],
    },
    {
      text: `* Item1.\n  * Item1-1`,
      output: `* Item1.\n  * Item1-1.`,
      options: {
        preferPeriodMark: ".",
      },
      errors: [
        {
          message: `Not exist period mark(".") at end of list item.`,
          line: 2,
          column: 11,
        },
      ],
    },
  ],
});
