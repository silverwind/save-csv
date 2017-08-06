# save-csv
[![](https://img.shields.io/npm/v/save-csv.svg?style=flat)](https://www.npmjs.org/package/save-csv) [![](https://img.shields.io/npm/dm/save-csv.svg)](https://www.npmjs.org/package/save-csv) [![](https://api.travis-ci.org/silverwind/save-csv.svg?style=flat)](https://travis-ci.org/silverwind/save-csv)
> Download an array of objects as a CSV file in the browser

`save-csv` is a tiny library (602 bytes gzipped) that creates a CSV file from a array of objects with matching keys and triggers a download in the browser.

## Example
```html
<script src="save-csv.js"></script>
```
```js
saveCsv(
  {a:1, b:2},
  {a:3, b:4},
);
```

## API
### save-csv(array, [options])
- `array` *Array*: An array containg objects with matching keys.
- `options` *Object*
  - `filename` *string*: The filename to save to. Default: `export.csv`.
  - `sep` *string*: The value separator. Default: `,`.
  - `eol` *string*: The line separator. Default: `\r\n`.
  - `bom` *boolean*: Whether to include a [byte order mark](https://en.wikipedia.org/wiki/Byte_order_mark) in the output. Default: `true`.
  - `mime` *string*: The mime type for the file. Default: `text/csv;charset=utf-8`.
  - `formatter` *Function*: A custom formatter function for values. The default function handles `,` in values and uses JSON.stringify for complex values. Receives `value`.

© [silverwind](https://github.com/silverwind), distributed under BSD licence
