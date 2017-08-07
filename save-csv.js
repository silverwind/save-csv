/*! save-csv v1.1.5 | (c) silverwind | BSD license */
(function(m) {
  if (typeof exports === "object" && typeof module === "object") {
    module.exports = m();
  } else if (typeof define === "function" && define.amd) {
    return define([], m);
  } else {
    this.saveCsv = m();
  }
})(function() {
  "use strict";
  return function(arr, opts) {
    if (!Array.isArray(arr) || !arr.length) {
      throw new Error("Expected an array of values, got " + arr);
    }

    opts = opts || {};
    opts.filename = opts.filename || "export.csv";
    opts.sep = opts.sep || ",";
    opts.eol = opts.eol || "\r\n";
    opts.bom = opts.bom || true;
    opts.quote = opts.quote || '"';
    opts.mime = opts.mime || "text/csv;charset=utf-8";

    opts.formatter = opts.formatter || function(value) {
      if (typeof value !== "string") {
        value = JSON.stringify(value) || "";
      }
      if (new RegExp(opts.sep).test(value)) {
        value = opts.quote + value + opts.quote;
      }
      return value;
    };

    // build header from first element in array
    var header = Object.keys(arr[0]).map(function(key) {
      return opts.formatter(key);
    }).join(opts.sep) + opts.eol;

    // build body
    var body = arr.map(function(obj) {
      return Object.keys(obj).map(function(key) {
        return opts.formatter(obj[key]);
      }).join(opts.sep);
    }).join(opts.eol);

    // build a link and trigger a download
    var text = header + body;
    var blob = new Blob([opts.bom ? "\ufeff" + text : text]);
    var a = document.createElement("a");
    a.setAttribute("href", URL.createObjectURL(blob, {type: opts.mime}));
    a.setAttribute("download", opts.filename);
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(document.body.removeChild.bind(null, a), 0);
  };
});
