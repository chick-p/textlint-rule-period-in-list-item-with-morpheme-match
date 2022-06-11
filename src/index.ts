import { TextlintRuleModule } from "@textlint/types";
// @ts-ignore
import checkEndsWithPeriod from "check-ends-with-period";

export interface Options {
  periodMarks: string[];
  preferPeriodMark: string;
}

const defaultOptions: Options = {
  periodMarks: ["。", "."],
  preferPeriodMark: "。",
};
// @ts-ignore
const report: TextlintRuleModule<Options> = (context, options = {}) => {
  const { Syntax, RuleError, report, fixer, getSource } = context;
  const periodMarks = options.periodMarks || defaultOptions.periodMarks;
  const preferPeriodMark =
    options.preferPeriodMark || defaultOptions.preferPeriodMark;
  return {
    async [Syntax.ListItem](node) {
      const paragraphNodes = node.children.filter(
        (node) => node.type === Syntax.Paragraph
      );
      const [firstParagraphNode] = paragraphNodes;
      const text = getSource(firstParagraphNode);
      const { valid, index } = checkEndsWithPeriod(text, {
        periodMarks,
      });
      if (valid) {
        return;
      }
      report(
        firstParagraphNode,
        new RuleError(
          `Not exist period mark("${preferPeriodMark}") at end of list item.`,
          {
            index,
            fix: fixer.replaceTextRange(
              [index + 1, index + 1],
              preferPeriodMark
            ),
          }
        )
      );
      return;
    },
  };
};

export default {
  linter: report,
  fixer: report,
};
