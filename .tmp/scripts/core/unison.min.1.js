"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Unison = function () {
  "use strict";
  var a,
      b = window,
      c = document,
      d = c.head,
      e = {},
      f = !1,
      g = { parseMQ: function parseMQ(a) {
      var c = b.getComputedStyle(a, null).getPropertyValue("font-family");return c.replace(/"/g, "").replace(/'/g, "");
    }, debounce: function debounce(a, b, c) {
      var d;return function () {
        var e = this,
            f = arguments;clearTimeout(d), d = setTimeout(function () {
          d = null, c || a.apply(e, f);
        }, b), c && !d && a.apply(e, f);
      };
    }, isObject: function isObject(a) {
      return "object" == (typeof a === "undefined" ? "undefined" : _typeof(a));
    }, isUndefined: function isUndefined(a) {
      return "undefined" == typeof a;
    } },
      h = { on: function on(a, b) {
      g.isObject(e[a]) || (e[a] = []), e[a].push(b);
    }, emit: function emit(a, b) {
      if (g.isObject(e[a])) for (var c = e[a].slice(), d = 0; d < c.length; d++) {
        c[d].call(this, b);
      }
    } },
      i = { all: function all() {
      for (var a = {}, b = g.parseMQ(c.querySelector("title")).split(","), d = 0; d < b.length; d++) {
        var e = b[d].trim().split(" ");a[e[0]] = e[1];
      }return f ? a : null;
    }, now: function now(a) {
      var b = g.parseMQ(d).split(" "),
          c = { name: b[0], width: b[1] };return f ? g.isUndefined(a) ? c : a(c) : null;
    }, update: function update() {
      i.now(function (b) {
        b.name !== a && (h.emit(b.name), h.emit("change", b), a = b.name);
      });
    } };return b.onresize = g.debounce(i.update, 100), c.addEventListener("DOMContentLoaded", function () {
    f = "none" !== b.getComputedStyle(d, null).getPropertyValue("clear"), i.update();
  }), { fetch: { all: i.all, now: i.now }, on: h.on, emit: h.emit, util: { debounce: g.debounce, isObject: g.isObject } };
}();
//# sourceMappingURL=unison.min.1.js.map
