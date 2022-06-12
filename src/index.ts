import { TextlintRuleModule } from "@textlint/types";
// @ts-ignore
import checkEndsWithPeriod from "check-ends-with-period";
import { tokenize } from "kuromojin";

export interface Options {
  periodMarks: string[];
  isAppendPeriod: boolean;
  preferPeriodMark: string;
  allowPosWithoutPeriod: string[];
}

const defaultOptions: Options = {
  periodMarks: ["。", "."],
  isAppendPeriod: false,
  preferPeriodMark: "。",
  allowPosWithoutPeriod: ["名詞", "記号"],
};

// @ts-ignore
const report: TextlintRuleModule<Options> = (context, options = {}) => {
  const { Syntax, RuleError, report, fixer, getSource } = context;
  const periodMarks = options.periodMarks || defaultOptions.periodMarks;
  const isAppendPeriod =
    options.isAppendPeriod || defaultOptions.isAppendPeriod;
  const preferPeriodMark =
    options.preferPeriodMark || defaultOptions.preferPeriodMark;
  const allowPosWithoutPeriod =
    options.allowPosWithoutPeriod || defaultOptions.allowPosWithoutPeriod;
  return {
    async [Syntax.ListItem](node) {
      const paragraphNodes = node.children.filter(
        (node) => node.type === Syntax.Paragraph
      );
      const [firstParagraphNode] = paragraphNodes;
      const text = getSource(firstParagraphNode);

      const { valid: hasPeriod, index } = checkEndsWithPeriod(text, {
        periodMarks,
        allowExceptionMark: false,
      });
      const tokens = await tokenize(text);
      if (hasPeriod) {
        // if a sentense has a period though disallow part of speech
        const lastToken = tokens.at(-2);
        if (lastToken && allowPosWithoutPeriod.includes(lastToken.pos)) {
          report(
            firstParagraphNode,
            new RuleError(
              `Shoud remove period mark("${preferPeriodMark}") at end of list item.`
            )
          );
          return;
        }
        return;
      }
      // if a sentence has not a period though without period
      const lastToken = tokens.at(-1);
      if (lastToken && !allowPosWithoutPeriod.includes(lastToken.pos)) {
        let fix;
        if (isAppendPeriod) {
          fix = fixer.replaceTextRange(
            [index + 1, index + 1],
            preferPeriodMark
          );
        }
        report(
          firstParagraphNode,
          new RuleError(
            `Not exist period mark("${preferPeriodMark}") at end of list item.`,
            {
              index,
              fix,
            }
          )
        );
        return;
      }
      return;
    },
  };
};

export default {
  linter: report,
  fixer: report,
};
