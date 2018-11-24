# save-csv
[![](https://img.shields.io/npm/v/save-csv.svg?style=flat)](https://www.npmjs.org/package/save-csv) [![](https://img.shields.io/npm/dm/save-csv.svg)](https://www.npmjs.org/package/save-csv) [![](https://api.travis-ci.org/silverwind/save-csv.svg?style=flat)](https://travis-ci.org/silverwind/save-csv)
> Download an array of objects as a CSV file in the browser

`save-csv` is a tiny library (892 bytes gzipped) that creates an CSV file from a array of objects with matching keys and triggers a download in the browser. Features:

- Automatically detects the value separator (usually `,`) based on the user's regional settings.
- Saves UTF8 by default and helps Excel to recognize this by adding a [byte order mark](https://en.wikipedia.org/wiki/Byte_order_mark).
- Fully configurable. Every output character can be modified via options.

## Example
```html
<script src="save-csv.min.js"></script>
```
```js
saveCsv([
  {a:1, b:2},
  {a:3, b:4},
]);
```
#### Output
```csv
a,b
1,2
3,4
```

## API
### save-csv(array, [options])
- `array` *Array*: An array containing objects with matching keys.
- `options` *Object*
  - `filename` *string*: The filename to save to. Default: `export.csv`.
  - `sep` *string*: The value separator (usually `,`). Recognizes the special value `auto` with which automatic detection based on the user's regional settings is attempted (See [#1](https://github.com/silverwind/save-csv/issues/1)). Default: `auto`.
  - `eol` *string*: The line separator. Default: `\r\n`.
  - `quote` *string*: The quote character to use. Default: `"`.
  - `bom` *boolean*: Whether to include a [byte order mark](https://en.wikipedia.org/wiki/Byte_order_mark) in the output. Default: `true`.
  - `mime` *string*: The mime type for the file. Default: `text/csv;charset=utf-8`.
  - `formatter` *Function*: A custom formatter function for values. The default function handles `sep` in values and uses `JSON.stringify` for complex values. Receives `value`.

© [silverwind](https://github.com/silverwind), distributed under BSD licence
