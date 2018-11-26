/** @format */

(() => {
  const allowedSymbols = {
    '%y': (ms1, ms2) => {
      const date1 = new Date(ms1);
      const date2 = new Date(ms2);
      return Math.abs(date1.getFullYear() - date2.getFullYear());
    },
    '%d': (ms1, ms2, format) => {
      const diff = ms1 - ms2;
      if (diff <= 0) return 0;

      if (format.indexOf('%Y') > -1 || format.indexOf('%y') > -1) {
        return parseInt((diff / 86400000) % 365).toLocaleString();
      }

      return parseInt(diff / 86400000).toLocaleString();
    },
    '%h': (ms1, ms2) => {
      const diff = ms1 - ms2;
      if (diff <= 0) return 0;
      return parseInt((diff / 3600000) % 60);
    },
    '%n': (ms1, ms2) => {
      const diff = ms1 - ms2;
      if (diff <= 0) return 0;
      return parseInt((diff / 60000) % 60);
    },
    '%s': (ms1, ms2) => {
      const diff = ms1 - ms2;
      if (diff <= 0) return 0;
      return parseInt((diff / 1000) % 60);
    },
    // zero prefixed
    '%Y': (ms1, ms2) => {
      const date1 = new Date(ms1);
      const date2 = new Date(ms2);
      return Math.abs(date1.getFullYear() - date2.getFullYear())
        .toString()
        .padStart(2, '0');
    },
    '%D': (ms1, ms2, format) => {
      const diff = ms1 - ms2;
      if (diff <= 0) return '00';

      if (format.indexOf('%Y') > -1 || format.indexOf('%y') > -1) {
        return parseInt((diff / 86400000) % 365)
          .toLocaleString()
          .toString()
          .padStart(2, '0');
      }

      return parseInt(diff / 86400000)
        .toLocaleString()
        .toString()
        .padStart(2, '0');
    },
    '%H': (ms1, ms2) => {
      const diff = ms1 - ms2;
      if (diff <= 0) return '00';

      return parseInt((diff / 3600000) % 60)
        .toString()
        .padStart(2, '0');
    },
    '%N': (ms1, ms2) => {
      const diff = ms1 - ms2;
      if (diff <= 0) return '00';

      return parseInt((diff / 60000) % 60)
        .toString()
        .padStart(2, '0');
    },
    '%S': (ms1, ms2) => {
      const diff = ms1 - ms2;
      if (diff <= 0) return '00';

      return parseInt((diff / 1000) % 60)
        .toString()
        .padStart(2, '0');
    }
  };

  function parseSymbols (ms1, ms2, format) {
    return Object.keys(allowedSymbols).reduce((parsed, symbolKey) => {
      if (parsed.indexOf(symbolKey) > -1) {
        return parsed.replace(symbolKey, allowedSymbols[symbolKey](ms1, ms2, format));
      }

      return parsed;
    }, format);
  }

  const toTwelveHourFormatMemoized = {};

  function toTwelveHourFormat (hours) {
    if (hours in toTwelveHourFormatMemoized) {
      return toTwelveHourFormatMemoized[hours];
    }

    const twelveHourFormat = hours % 12;
    if (twelveHourFormat === 0) return 12;
    return twelveHourFormat;
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
  const shortMonthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  const weekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const shortWeekNames = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
  const allowedFormats = {
    '%y': instance => instance.getFullYear(),
    '%m': instance => instance.getMonth() + 1,
    '%d': instance => instance.getDate(),
    '%f': instance => monthNames[instance.getMonth()],
    '%w': instance => weekNames[instance.getDay()],
    '%i': instance => instance.getHours(),
    '%h': instance => toTwelveHourFormat(instance.getHours()),
    '%n': instance => instance.getMinutes(),
    '%s': instance => instance.getSeconds(),
    '%a': instance => (instance.getHours() >= 12 ? 'PM' : 'AM'),
    // shortened
    '%Y': instance => {
      const year = instance.getFullYear().toString();
      return year.substring(year.length - 2);
    },
    '%F': instance => shortMonthNames[instance.getMonth()],
    '%W': instance => shortWeekNames[instance.getDay()],
    // zero prefixed
    '%I': instance =>
      instance
        .getHours()
        .toString()
        .padStart(2, '0'),
    '%M': instance => (instance.getMonth() + 1).toString().padStart(2, '0'),
    '%D': instance =>
      instance
        .getDate()
        .toString()
        .padStart(2, '0'),
    '%H': instance =>
      toTwelveHourFormat(instance.getHours())
        .toString()
        .padStart(2, '0'),
    '%N': instance =>
      instance
        .getMinutes()
        .toString()
        .padStart(2, '0'),
    '%S': instance =>
      instance
        .getSeconds()
        .toString()
        .padStart(2, '0')
  };

  Date.prototype.format = function (format) {
    return Object.keys(allowedFormats).reduce((formatted, formatKey) => {
      if (formatted.indexOf(formatKey) >= 0) {
        return formatted.replace(formatKey, allowedFormats[formatKey](this));
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

  const names = {
    '%s': 'second',
    '%n': 'minute',
    '%h': 'hour',
    '%d': 'day',
    '%m': 'month',
    '%y': 'year'
  };

  Date.prototype.timeAgo = function (pastDateMilliseconds, symbols) {
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

      if (value === 0 || nameKey in names === false) {
        return compiled;
      }

      const str = compiled ? compiled + ' ' : '';

      if (value === 1) {
        return str + replacedString[i] + ' ' + names[nameKey];
      }

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

  Date.prototype.age = function (now) {
    const context = now || new Date();

    if (context < this) {
      return 0;
    }

    let diffYear = Math.abs(this.getFullYear() - context.getFullYear());

    if (diffYear > 0) {
      diffYear -= 1;
    }

    if (
      context.getMonth() > this.getMonth() ||
      (context.getMonth() === this.getMonth() && context.getDate() >= this.getDate())
    ) {
      return diffYear + 1;
    }

    return diffYear;
  };
})();
