/** @format */

(() => {
  function parseSymbols (ms1, ms2, format) {
    const allowedFormats = {
      '%y': () => {
        const date1 = new Date(ms1);
        const date2 = new Date(ms2);
        return Math.abs(date1.getFullYear() - date2.getFullYear());
      },
      '%d': () => {
        const diff = ms1 - ms2;
        if (diff <= 0) return 0;

        if (format.indexOf('%Y') > -1 || format.indexOf('%y') > -1) {
          return parseInt((diff / 86400000) % 365);
        }

        return parseInt(diff / 86400000);
      },
      '%h': () => {
        const diff = ms1 - ms2;
        if (diff <= 0) return 0;
        return parseInt((diff / 3600000) % 60);
      },
      '%n': () => {
        const diff = ms1 - ms2;
        if (diff <= 0) return 0;
        return parseInt((diff / 60000) % 60);
      },
      '%s': () => {
        const diff = ms1 - ms2;
        if (diff <= 0) return 0;
        return parseInt((diff / 1000) % 60);
      },
      // zero prefixed
      '%Y': () => {
        const date1 = new Date(ms1);
        const date2 = new Date(ms2);
        return Math.abs(date1.getFullYear() - date2.getFullYear())
          .toString()
          .padStart(2, '0');
      },
      '%D': () => {
        const diff = ms1 - ms2;
        if (diff <= 0) return '00';

        if (format.indexOf('%Y') > -1 || format.indexOf('%y') > -1) {
          return parseInt((diff / 86400000) % 365)
            .toString()
            .padStart(2, '0');
        }

        return parseInt(diff / 86400000)
          .toString()
          .padStart(2, '0');
      },
      '%H': () => {
        const diff = ms1 - ms2;
        if (diff <= 0) return '00';

        return parseInt((diff / 3600000) % 60)
          .toString()
          .padStart(2, '0');
      },
      '%N': () => {
        const diff = ms1 - ms2;
        if (diff <= 0) return '00';

        return parseInt((diff / 60000) % 60)
          .toString()
          .padStart(2, '0');
      },
      '%S': () => {
        const diff = ms1 - ms2;
        if (diff <= 0) return '00';

        return parseInt((diff / 1000) % 60)
          .toString()
          .padStart(2, '0');
      }
    };

    return Object.keys(allowedFormats).reduce((d, formatKey) => {
      if (d.indexOf(formatKey) >= 0) return d.replace(formatKey, allowedFormats[formatKey]());
      return d;
    }, format);
  }

  function toTwelveHourFormat (hours) {
    const twelveHourFormat = hours % 12;
    if (twelveHourFormat === 0) return 12;
    return twelveHourFormat;
  }

  Date.prototype.format = function (format) {
    // January => Jan, Sunday => Sun
    function shorten (s, l) {
      const reversed = s
        .toString()
        .split('')
        .reverse()
        .join('');
      return reversed
        .substr(reversed.length - l)
        .split('')
        .reverse()
        .join('');
    }

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    const weekNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ];
    const allowedFormats = {
      '%y': () => this.getFullYear(),
      '%m': () => this.getMonth() + 1,
      '%d': () => this.getDate(),
      '%f': () => monthNames[this.getMonth()],
      '%w': () => weekNames[this.getDay()],
      '%i': () => this.getHours(),
      '%h': () => toTwelveHourFormat(this.getHours()),
      '%n': () => this.getMinutes(),
      '%s': () => this.getSeconds(),
      '%a': () => (this.getHours() >= 12 ? 'PM' : 'AM'),
      // shortened
      '%Y': () => {
        const year = this.getFullYear().toString();
        return year.substring(year.length - 2);
      },
      '%F': () => shorten(monthNames[this.getMonth()], 3),
      '%W': () => shorten(weekNames[this.getDay()], 3),
      // zero prefixed
      '%I': () =>
        this.getHours()
          .toString()
          .padStart(2, '0'),
      '%M': () => (this.getMonth() + 1).toString().padStart(2, '0'),
      '%D': () =>
        this.getDate()
          .toString()
          .padStart(2, '0'),
      '%H': () =>
        toTwelveHourFormat(this.getHours())
          .toString()
          .padStart(2, '0'),
      '%N': () =>
        this.getMinutes()
          .toString()
          .padStart(2, '0'),
      '%S': () =>
        this.getSeconds()
          .toString()
          .padStart(2, '0')
    };

    return Object.keys(allowedFormats).reduce((d, formatKey) => {
      if (d.indexOf(formatKey) >= 0) return d.replace(formatKey, allowedFormats[formatKey]());
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
    const names = {
      '%s': 'second',
      '%n': 'minute',
      '%h': 'hour',
      '%d': 'day',
      '%m': 'month',
      '%y': 'year'
    };
    let replacedString;
    if (pastDateMilliseconds instanceof Date) {
      replacedString = parseSymbols(
        this.getTime(),
        pastDateMilliseconds.getTime(),
        symbols.join('|')
      ).split('|');
    } else {
      replacedString = parseSymbols(this.getTime(), pastDateMilliseconds, symbols.join('|')).split(
        '|'
      );
    }

    const parsedTime = symbols.reduce((compiled, key, i) => {
      const value = parseInt(replacedString[i]);
      const nameKey = key.toLowerCase();
      if (value === 0 || names[nameKey] === undefined) return compiled;
      const str = compiled ? compiled + ' ' : '';
      if (value === 1) return str + replacedString[i] + ' ' + names[nameKey];
      return str + replacedString[i] + ' ' + names[nameKey] + 's';
    }, null);

    if (!parsedTime) {
      const nameKeys = Object.keys(names);

      for (let a = 0; a < nameKeys.length; a++) {
        if (!symbols.includes(nameKeys[a]) && !symbols.includes(nameKeys[a].toUpperCase()))
          continue;

        let symbol = symbols[symbols.indexOf(nameKeys[a])];
        if (!symbol) symbol = symbols[symbols.indexOf(nameKeys[a].toUpperCase())];

        return parseSymbols(1, 1, symbol) + ' ' + names[nameKeys[a]] + 's ago';
      }

      return '';
    }

    return parsedTime + ' ago';
  };

  Date.prototype.age = function (now = new Date()) {
    if (now < this) return 0;

    let diffYear = Math.abs(this.getFullYear() - now.getFullYear());

    if (diffYear > 0) diffYear -= 1;

    if (
      now.getMonth() > this.getMonth() ||
      (now.getMonth() === this.getMonth() && now.getDate() >= this.getDate())
    ) {
      return diffYear + 1;
    }

    return diffYear;
  };
})();
