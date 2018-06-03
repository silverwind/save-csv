/*! save-csv v4.0.7 | (c) silverwind | BSD license */
(function(root, m) {
  if (typeof define === "function" && define.amd) {
    define([], m);
  } else if (typeof module === "object" && module.exports) {
    module.exports = m();
  } else {
    root.saveCsv = m();
  }
})(typeof self !== "undefined" ? self : this, function() {
  "use strict";
  return function(arr, opts) {
    if (!Array.isArray(arr) || !arr.length) {
      throw new Error("Expected an array of values, got " + arr);
    }

    opts = opts || {};
    opts.filename = opts.filename || "export.csv";
    opts.sep = opts.sep || "auto";
    opts.eol = opts.eol || "\r\n";
    opts.bom = typeof opts.bom === "boolean" ? opts.bom : true;
    opts.quote = opts.quote || '"';
    opts.mime = opts.mime || "text/csv;charset=utf-8";

    // This is not ideal, but given that Array.prototype.toLocaleString is
    // rather unreliable, it's a good compromise.
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1388777
    // https://bugs.chromium.org/p/chromium/issues/detail?id=753841
    if (opts.sep === "auto") {
      if ("toLocaleString" in Number.prototype) {
        opts.sep = (1.2).toLocaleString().substring(1, 2) === "," ? ";" : ",";
      } else {
        opts.sep = ",";
      }
    }

    var quoteRe = new RegExp(opts.quote, "g");
    var sepRe = new RegExp(opts.sep, "g");

    opts.formatter = opts.formatter || function(value) {
      var quoted = false;

      if (typeof value !== "string") {
        value = JSON.stringify(value) || "";
      }

      // escape quotes by doubling the quotes and wrapping in quotes
      if (quoteRe.test(value)) {
        value = opts.quote + value.replace(quoteRe, opts.quote + opts.quote) + opts.quote;
        quoted = true;
      }

      // escape separator by wrapping in quotes
      if (sepRe.test(value) && !quoted) {
        value = opts.quote + value + opts.quote;
      }

      return value;
    };

    // build headers from first element in array
    var paths = [];
    (function scan(prefix, obj, keys) {
      keys.forEach(function(key) {
        var path = prefix ? prefix + "." + key : key;
        if (typeof obj[key] === "object" && obj[key] !== null) {
          scan(path, obj[key], Object.keys(obj[key]));
        } else {
          paths.push(opts.formatter(path));
        }
      });
    })(null, arr[0], Object.keys(arr[0]));
    var header = paths.join(opts.sep) + opts.eol;

    // build body
    var body = arr.map(function(obj) {
      var row = [];
      (function scan(obj, keys) {
        keys.forEach(function(key) {
          if (typeof obj[key] === "object" && obj[key] !== null) {
            scan(obj[key], Object.keys(obj[key]));
          } else {
            row.push(opts.formatter(obj[key]));
          }
        });
      })(obj, Object.keys(obj));
      return row.join(opts.sep);
    }).join(opts.eol);

    // build a link and trigger a download
    var text = header + body;
    var blob = new Blob([opts.bom ? "\ufeff" + text : text]);

    if (window.navigator.msSaveBlob) { // compat: ie10
      window.navigator.msSaveBlob(blob, opts.filename);
    } else {
      var a = document.createElement("a");
      a.setAttribute("href", URL.createObjectURL(blob, {type: opts.mime}));
      a.setAttribute("download", opts.filename);
      a.setAttribute("target", "_blank");
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
        document.body.removeChild(a);
      }, 0);
    }
  };
});
