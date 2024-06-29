import {
  TxtParagraphNode,
  ASTNodeTypes,
  TxtStrNode,
} from "@textlint/ast-node-types";
import { TxtParentNode } from "@textlint/ast-node-types/lib/src/NodeType";
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

const collectLastStrNodes = (paragraphNode: TxtParagraphNode): TxtStrNode[] => {
  const lastStrNodes = [];
  let lastStrNode = null;
  for (const child of paragraphNode.children) {
    if (child.type === ASTNodeTypes.Break) {
      // LineBreak
      if (lastStrNode !== null) {
        lastStrNodes.push(lastStrNode);
      }
      continue;
    }

    if (child.type === ASTNodeTypes.Str) {
      // Text
      const strNode = child as TxtStrNode;
      lastStrNode = strNode;
      continue;
    }

    if (child.type === ASTNodeTypes.Link || child.type === ASTNodeTypes.Code) {
      // Link or Code
      lastStrNode = null;
      continue;
    }

    const txtParentNode = child as TxtParentNode;
    if (txtParentNode !== null) {
      // Emphasis, Strong etc...
      txtParentNode.children?.forEach((grandchild) => {
        if (grandchild.type === ASTNodeTypes.Str) {
          lastStrNode = grandchild as TxtStrNode;
        }
      });
      continue;
    }
  }

  if (lastStrNode !== null) {
    lastStrNodes.push(lastStrNode);
  }

  return lastStrNodes;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
    async [Syntax.Paragraph](node) {
      // only check list items
      if (node.parent?.type !== ASTNodeTypes.ListItem) {
        return;
      }

      const paragraphNode = node as TxtParagraphNode;

      const strNodes = collectLastStrNodes(paragraphNode);

      for (const strNode of strNodes) {
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
                "",
              );
            }
            report(
              strNode,
              new RuleError(
                `Should remove period mark("${foundPeriodMark}") at end of list item.`,
                {
                  index,
                  fix,
                },
              ),
            );
          }
          return;
        }
        // if a sentence has not a period though without period
        const lastToken = tokens.at(-1);
        if (lastToken && !allowPosWithoutPeriod.includes(lastToken.pos)) {
          let fix;
          if (isAppendPeriod) {
            if (periodMark === "") {
              fix = fixer.replaceText(node, preferPeriodMark);
            } else {
              fix = fixer.replaceTextRange(
                [index + 1, index + 1],
                preferPeriodMark,
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
              },
            ),
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
