# textlint-rule-period-in-list-item-with-morpheme-match

![](https://github.com/chick-p/textlint-rule-period-in-list-item-with-morpheme-match/workflows/test/badge.svg?branch=main)

## Install

Install with GitHub

## Usage

Via `.textlintrc`(Recommended)

```json
{
  "rules": {
    "period-in-list-item-with-morpheme-match": true
  }
}
```

Via CLI

```shell
textlint --rule period-in-list-item-with-morpheme-match README.md
```

## Options

```json
{
  // recognized list of period mark
  "periodMarks": ["。", "."],
  // Ignore to check sentence if morpheme of the last word is in this list
  "allowPosWithoutPeriod": ["名詞", "記号"]
}
```

### Build

Builds source codes for publish to the `lib` folder.
You can write ES2015+ source codes in `src/` folder.

```shell
npm run build
```

### Tests

Run test code in `test` folder.
Test textlint rule by [textlint-tester](https://github.com/textlint/textlint-tester).

```shell
npm test
```

## License

MIT © chick-p
