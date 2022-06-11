# textlint-rule-period-in-list-item-with-morpheme-match

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

```
textlint --rule period-in-list-item-with-morpheme-match README.md
```

### Build

Builds source codes for publish to the `lib` folder.
You can write ES2015+ source codes in `src/` folder.

    npm run build

### Tests

Run test code in `test` folder.
Test textlint rule by [textlint-tester](https://github.com/textlint/textlint-tester).

    npm test

## License

MIT © chick-p
