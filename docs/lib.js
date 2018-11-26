'use strict';

/** @format */

(function () {
  var allowedSymbols = {
    '%y': function y(ms1, ms2) {
      var date1 = new Date(ms1);
      var date2 = new Date(ms2);
      return Math.abs(date1.getFullYear() - date2.getFullYear());
    },
    '%d': function d(ms1, ms2, format) {
      var diff = ms1 - ms2;
      if (0 >= diff) return 0;

      if (-1 < format.indexOf('%Y') || -1 < format.indexOf('%y')) {
        return parseInt(diff / 86400000 % 365).toLocaleString();
      }

      return parseInt(diff / 86400000).toLocaleString();
    },
    '%h': function h(ms1, ms2) {
      var diff = ms1 - ms2;
      if (0 >= diff) return 0;
      return parseInt(diff / 3600000 % 60);
    },
    '%n': function n(ms1, ms2) {
      var diff = ms1 - ms2;
      if (0 >= diff) return 0;
      return parseInt(diff / 60000 % 60);
    },
    '%s': function s(ms1, ms2) {
      var diff = ms1 - ms2;
      if (0 >= diff) return 0;
      return parseInt(diff / 1000 % 60);
    },
    // zero prefixed
    '%Y': function Y(ms1, ms2) {
      var date1 = new Date(ms1);
      var date2 = new Date(ms2);
      return Math.abs(date1.getFullYear() - date2.getFullYear()).toString().padStart(2, '0');
    },
    '%D': function D(ms1, ms2, format) {
      var diff = ms1 - ms2;
      if (0 >= diff) return '00';

      if (-1 < format.indexOf('%Y') || -1 < format.indexOf('%y')) {
        return parseInt(diff / 86400000 % 365).toLocaleString().toString().padStart(2, '0');
      }

      return parseInt(diff / 86400000).toLocaleString().toString().padStart(2, '0');
    },
    '%H': function H(ms1, ms2) {
      var diff = ms1 - ms2;
      if (0 >= diff) return '00';

      return parseInt(diff / 3600000 % 60).toString().padStart(2, '0');
    },
    '%N': function N(ms1, ms2) {
      var diff = ms1 - ms2;
      if (0 >= diff) return '00';

      return parseInt(diff / 60000 % 60).toString().padStart(2, '0');
    },
    '%S': function S(ms1, ms2) {
      var diff = ms1 - ms2;
      if (0 >= diff) return '00';

      return parseInt(diff / 1000 % 60).toString().padStart(2, '0');
    }
  };

  function parseSymbols(ms1, ms2, format) {
    return Object.keys(allowedSymbols).reduce(function (parsed, symbolKey) {
      if (-1 < parsed.indexOf(symbolKey)) {
        return parsed.replace(symbolKey, allowedSymbols[symbolKey](ms1, ms2, format));
      }

      return parsed;
    }, format);
  }

  var toTwelveHourFormatMemoized = {};

  function toTwelveHourFormat(hours) {
    if (hours in toTwelveHourFormatMemoized) {
      return toTwelveHourFormatMemoized[hours];
    }

    var twelveHourFormat = hours % 12;
    if (0 === twelveHourFormat) return 12;
    return twelveHourFormat;
  }

  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var weekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var shortWeekNames = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
  var allowedFormats = {
    '%y': function y(instance) {
      return instance.getFullYear();
    },
    '%m': function m(instance) {
      return instance.getMonth() + 1;
    },
    '%d': function d(instance) {
      return instance.getDate();
    },
    '%f': function f(instance) {
      return monthNames[instance.getMonth()];
    },
    '%w': function w(instance) {
      return weekNames[instance.getDay()];
    },
    '%i': function i(instance) {
      return instance.getHours();
    },
    '%h': function h(instance) {
      return toTwelveHourFormat(instance.getHours());
    },
    '%n': function n(instance) {
      return instance.getMinutes();
    },
    '%s': function s(instance) {
      return instance.getSeconds();
    },
    '%a': function a(instance) {
      return 12 <= instance.getHours() ? 'PM' : 'AM';
    },
    // shortened
    '%Y': function Y(instance) {
      var year = instance.getFullYear().toString();
      return year.substring(year.length - 2);
    },
    '%F': function F(instance) {
      return shortMonthNames[instance.getMonth()];
    },
    '%W': function W(instance) {
      return shortWeekNames[instance.getDay()];
    },
    // zero prefixed
    '%I': function I(instance) {
      return instance.getHours().toString().padStart(2, '0');
    },
    '%M': function M(instance) {
      return (instance.getMonth() + 1).toString().padStart(2, '0');
    },
    '%D': function D(instance) {
      return instance.getDate().toString().padStart(2, '0');
    },
    '%H': function H(instance) {
      return toTwelveHourFormat(instance.getHours()).toString().padStart(2, '0');
    },
    '%N': function N(instance) {
      return instance.getMinutes().toString().padStart(2, '0');
    },
    '%S': function S(instance) {
      return instance.getSeconds().toString().padStart(2, '0');
    }
  };

  Date.prototype.format = function (format) {
    var _this = this;

    return Object.keys(allowedFormats).reduce(function (formatted, formatKey) {
      if (0 <= formatted.indexOf(formatKey)) {
        return formatted.replace(formatKey, allowedFormats[formatKey](_this));
      }

      return formatted;
    }, format);
  };

  Date.prototype.timeDiff = function (futureDateMilliseconds, format) {
    if (futureDateMilliseconds instanceof Date) {
      return parseSymbols(futureDateMilliseconds.getTime(), this.getTime(), format);
    }

    return parseSymbols(futureDateMilliseconds, this.getTime(), format);
  };

  var names = {
    '%s': 'second',
    '%n': 'minute',
    '%h': 'hour',
    '%d': 'day',
    '%m': 'month',
    '%y': 'year'
  };

  Date.prototype.timeAgo = function (pastDateMilliseconds, symbols) {
    var replacedString = void 0;
    if (pastDateMilliseconds instanceof Date) {
      replacedString = parseSymbols(this.getTime(), pastDateMilliseconds.getTime(), symbols.join('|')).split('|');
    } else {
      replacedString = parseSymbols(this.getTime(), pastDateMilliseconds, symbols.join('|')).split('|');
    }

    var parsedTime = symbols.reduce(function (compiled, key, i) {
      var value = parseInt(replacedString[i]);
      var nameKey = key.toLowerCase();

      if (0 === value || !1 === nameKey in names) {
        return compiled;
      }

      var str = compiled ? compiled + ' ' : '';

      if (1 === value) {
        return str + replacedString[i] + ' ' + names[nameKey];
      }

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

  Date.prototype.age = function (now) {
    var context = now || new Date();

    if (context < this) {
      return 0;
    }

    var diffYear = Math.abs(this.getFullYear() - context.getFullYear());

    if (0 < diffYear) {
      diffYear -= 1;
    }

    if (context.getMonth() > this.getMonth() || context.getMonth() === this.getMonth() && context.getDate() >= this.getDate()) {
      return diffYear + 1;
    }

    return diffYear;
  };
})();