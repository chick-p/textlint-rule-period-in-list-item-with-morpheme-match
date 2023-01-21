import { TxtNode } from "@textlint/ast-node-types";
import { TextlintRuleModule } from "@textlint/types";
import { checkEndsWithPeriod } from "check-ends-with-period";
import { tokenize } from "kuromojin";

export interface Options {
  periodMarks: string[];
  isAppendPeriod: boolean;
  isRemovePeriod: boolean;
  preferPeriodMark: string;
  allowPosWithoutPeriod: string[];
}

const defaultOptions: Options = {
  periodMarks: ["。", "."],
  isAppendPeriod: false,
  isRemovePeriod: false,
  preferPeriodMark: "。",
  allowPosWithoutPeriod: ["名詞", "記号"],
};

// @ts-ignore
const report: TextlintRuleModule<Options> = (context, options = {}) => {
  const { Syntax, RuleError, report, fixer, getSource } = context;
  const periodMarks = options.periodMarks || defaultOptions.periodMarks;
  const isAppendPeriod =
    options.isAppendPeriod || defaultOptions.isAppendPeriod;
  const isRemovePeriod =
    options.isRemovePeriod || defaultOptions.isRemovePeriod;
  const preferPeriodMark =
    options.preferPeriodMark || defaultOptions.preferPeriodMark;
  const allowPosWithoutPeriod =
    options.allowPosWithoutPeriod || defaultOptions.allowPosWithoutPeriod;
  return {
    async [Syntax.ListItem](node) {
      const paragraphNodes = node.children.filter(
        (n) => n.type === Syntax.Paragraph
      );
      const [firstParagraphNode] = paragraphNodes;
      let childStrNodes = firstParagraphNode.children.filter(
        (n: TxtNode) => n.type === Syntax.Str
      );
      for (const strNode of childStrNodes) {
        const text = getSource(strNode);

        const result = checkEndsWithPeriod(text, {
          periodMarks,
          allowExceptionMark: false,
        });
        if (!result) {
          continue;
        }
        const { valid: hasPeriod, index, periodMark } = result;

        const tokens = await tokenize(text);
        if (hasPeriod) {
          // if a sentense has a period though disallow part of speech
          const lastToken = tokens.at(-2);
          if (lastToken && allowPosWithoutPeriod.includes(lastToken.pos)) {
            let fix;
            const foundPeriodMark = text[index];
            if (isRemovePeriod) {
              fix = fixer.replaceTextRange(
                [index, index + foundPeriodMark.length],
                ""
              );
            }
            report(
              strNode,
              new RuleError(
                `Should remove period mark("${foundPeriodMark}") at end of list item.`,
                {
                  index,
                  fix,
                }
              )
            );
          }
          return;
        }
        // if a sentence has not a period though without period
        const lastToken = tokens.at(-1);
        if (lastToken && !allowPosWithoutPeriod.includes(lastToken.pos)) {
          let fix;
          if (isAppendPeriod) {
            if(periodMark === "") {
              fix = fixer.replaceText(
                node,
                preferPeriodMark
              );

            } else {
              fix = fixer.replaceTextRange(
                [index + 1, index + 1],
                preferPeriodMark
              );
            }
          }
          report(
            strNode,
            new RuleError(
              `Not exist period mark("${preferPeriodMark}") at end of list item.`,
              {
                index,
                fix,
              }
            )
          );
        }
      }
    },
  };
};

export default {
  linter: report,
  fixer: report,
};
