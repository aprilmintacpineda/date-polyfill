'use strict';

/** @format */

(function () {
  function parseSymbols(ms1, ms2, format) {
    var allowedFormats = {
      '%y': function y() {
        var date1 = new Date(ms1);
        var date2 = new Date(ms2);
        return Math.abs(date1.getFullYear() - date2.getFullYear());
      },
      '%d': function d() {
        var diff = ms1 - ms2;
        if (0 >= diff) return 0;

        if (-1 < format.indexOf('%Y') || -1 < format.indexOf('%y')) {
          return parseInt(diff / 86400000 % 365).toLocaleString();
        }

        return parseInt(diff / 86400000).toLocaleString();
      },
      '%h': function h() {
        var diff = ms1 - ms2;
        if (0 >= diff) return 0;
        return parseInt(diff / 3600000 % 60);
      },
      '%n': function n() {
        var diff = ms1 - ms2;
        if (0 >= diff) return 0;
        return parseInt(diff / 60000 % 60);
      },
      '%s': function s() {
        var diff = ms1 - ms2;
        if (0 >= diff) return 0;
        return parseInt(diff / 1000 % 60);
      },
      // zero prefixed
      '%Y': function Y() {
        var date1 = new Date(ms1);
        var date2 = new Date(ms2);
        return Math.abs(date1.getFullYear() - date2.getFullYear()).toString().padStart(2, '0');
      },
      '%D': function D() {
        var diff = ms1 - ms2;
        if (0 >= diff) return '00';

        if (-1 < format.indexOf('%Y') || -1 < format.indexOf('%y')) {
          return parseInt(diff / 86400000 % 365).toLocaleString().toString().padStart(2, '0');
        }

        return parseInt(diff / 86400000).toLocaleString().toString().padStart(2, '0');
      },
      '%H': function H() {
        var diff = ms1 - ms2;
        if (0 >= diff) return '00';

        return parseInt(diff / 3600000 % 60).toString().padStart(2, '0');
      },
      '%N': function N() {
        var diff = ms1 - ms2;
        if (0 >= diff) return '00';

        return parseInt(diff / 60000 % 60).toString().padStart(2, '0');
      },
      '%S': function S() {
        var diff = ms1 - ms2;
        if (0 >= diff) return '00';

        return parseInt(diff / 1000 % 60).toString().padStart(2, '0');
      }
    };

    return Object.keys(allowedFormats).reduce(function (d, formatKey) {
      if (0 <= d.indexOf(formatKey)) return d.replace(formatKey, allowedFormats[formatKey]());
      return d;
    }, format);
  }

  function toTwelveHourFormat(hours) {
    var twelveHourFormat = hours % 12;
    if (0 === twelveHourFormat) return 12;
    return twelveHourFormat;
  }

  Date.prototype.format = function (format) {
    var _this = this;

    // January => Jan, Sunday => Sun
    function shorten(s, l) {
      var reversed = s.toString().split('').reverse().join('');
      return reversed.substr(reversed.length - l).split('').reverse().join('');
    }

    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var weekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var allowedFormats = {
      '%y': function y() {
        return _this.getFullYear();
      },
      '%m': function m() {
        return _this.getMonth() + 1;
      },
      '%d': function d() {
        return _this.getDate();
      },
      '%f': function f() {
        return monthNames[_this.getMonth()];
      },
      '%w': function w() {
        return weekNames[_this.getDay()];
      },
      '%i': function i() {
        return _this.getHours();
      },
      '%h': function h() {
        return toTwelveHourFormat(_this.getHours());
      },
      '%n': function n() {
        return _this.getMinutes();
      },
      '%s': function s() {
        return _this.getSeconds();
      },
      '%a': function a() {
        return 12 <= _this.getHours() ? 'PM' : 'AM';
      },
      // shortened
      '%Y': function Y() {
        var year = _this.getFullYear().toString();
        return year.substring(year.length - 2);
      },
      '%F': function F() {
        return shorten(monthNames[_this.getMonth()], 3);
      },
      '%W': function W() {
        return shorten(weekNames[_this.getDay()], 3);
      },
      // zero prefixed
      '%I': function I() {
        return _this.getHours().toString().padStart(2, '0');
      },
      '%M': function M() {
        return (_this.getMonth() + 1).toString().padStart(2, '0');
      },
      '%D': function D() {
        return _this.getDate().toString().padStart(2, '0');
      },
      '%H': function H() {
        return toTwelveHourFormat(_this.getHours()).toString().padStart(2, '0');
      },
      '%N': function N() {
        return _this.getMinutes().toString().padStart(2, '0');
      },
      '%S': function S() {
        return _this.getSeconds().toString().padStart(2, '0');
      }
    };

    return Object.keys(allowedFormats).reduce(function (d, formatKey) {
      if (0 <= d.indexOf(formatKey)) return d.replace(formatKey, allowedFormats[formatKey]());
      return d;
    }, format);
  };

  Date.prototype.timeDiff = function (futureDateMilliseconds, format) {
    if (futureDateMilliseconds instanceof Date) {
      return parseSymbols(futureDateMilliseconds.getTime(), this.getTime(), format);
    }

    return parseSymbols(futureDateMilliseconds, this.getTime(), format);
  };

  Date.prototype.timeAgo = function (pastDateMilliseconds, symbols) {
    var names = {
      '%s': 'second',
      '%n': 'minute',
      '%h': 'hour',
      '%d': 'day',
      '%m': 'month',
      '%y': 'year'
    };
    var replacedString = void 0;
    if (pastDateMilliseconds instanceof Date) {
      replacedString = parseSymbols(this.getTime(), pastDateMilliseconds.getTime(), symbols.join('|')).split('|');
    } else {
      replacedString = parseSymbols(this.getTime(), pastDateMilliseconds, symbols.join('|')).split('|');
    }

    var parsedTime = symbols.reduce(function (compiled, key, i) {
      var value = parseInt(replacedString[i]);
      var nameKey = key.toLowerCase();
      if (0 === value || names[nameKey] === undefined) return compiled;
      var str = compiled ? compiled + ' ' : '';
      if (1 === value) return str + replacedString[i] + ' ' + names[nameKey];
      return str + replacedString[i] + ' ' + names[nameKey] + 's';
    }, null);

    if (!parsedTime) {
      var nameKeys = Object.keys(names);

      for (var a = 0; a < nameKeys.length; a++) {
        if (!symbols.includes(nameKeys[a]) && !symbols.includes(nameKeys[a].toUpperCase())) continue;

        var symbol = symbols[symbols.indexOf(nameKeys[a])];
        if (!symbol) symbol = symbols[symbols.indexOf(nameKeys[a].toUpperCase())];

        return parseSymbols(1, 1, symbol) + ' ' + names[nameKeys[a]] + 's ago';
      }

      return '';
    }

    return parsedTime + ' ago';
  };

  Date.prototype.age = function () {
    var now = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();

    if (now < this) return 0;

    var diffYear = Math.abs(this.getFullYear() - now.getFullYear());

    if (0 < diffYear) diffYear -= 1;

    if (now.getMonth() > this.getMonth() || now.getMonth() === this.getMonth() && now.getDate() >= this.getDate()) {
      return diffYear + 1;
    }

    return diffYear;
  };
})();