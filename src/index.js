(() => {
  function prefixZero (s) {
    return s.toString().length === 1 ? `0${s}` : s;
  }

  function parseSymbols (ms, format) {
    const allowedFormats = {
      '%d': () => ms > 0? parseInt(ms / 86400000) : 0,
      '%h': () => ms > 0? parseInt((ms / 3600000) % 60) : 0,
      '%n': () => ms > 0? parseInt((ms / 60000) % 60) : 0,
      '%s': () => ms > 0? parseInt((ms / 1000) % 60) : 0,
      // zero prefixed
      '%D': () => prefixZero(ms > 0? parseInt(ms / 86400000) : 0),
      '%H': () => prefixZero(ms > 0? parseInt((ms / 3600000) % 60) : 0),
      '%N': () => prefixZero(ms > 0? parseInt((ms / 60000) % 60) : 0),
      '%S': () => prefixZero(ms > 0? parseInt((ms / 1000) % 60) : 0)
    };

    return Object.keys(allowedFormats).reduce((d, formatKey) => {
      if (d.indexOf(formatKey) >= 0) return d.replace(formatKey, allowedFormats[formatKey]());
      return d;
    }, format);
  }

  function toTwelveHourFormat (hours) {
    if (hours > 12) return hours % 12;
    return hours;
  }

  Date.prototype.format = function (format) {
    // January => Jan, Sunday => Sun
    function shorten (s, l) {
      const reversed = s.toString().split('').reverse().join('');
      return reversed.substr(reversed.length - l).split('').reverse().join('');
    }

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const weekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
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
      '%a': () => this.getHours() >= 12? 'PM' : 'AM',
      // shortened
      '%Y': () => {
        const year = this.getFullYear().toString();
        return year.substring(year.length - 2);
      },
      '%F': () => shorten(monthNames[this.getMonth()], 3),
      '%W': () => shorten(weekNames[this.getDay()], 3),
      // zero prefixed
      '%I': () => prefixZero(this.getHours()),
      '%M': () => prefixZero(this.getMonth() + 1),
      '%D': () => prefixZero(this.getDate()),
      '%H': () => prefixZero(toTwelveHourFormat(this.getHours())),
      '%N': () => prefixZero(this.getMinutes()),
      '%S': () => prefixZero(this.getSeconds())
    };

    return Object.keys(allowedFormats).reduce((d, formatKey) => {
      if (d.indexOf(formatKey) >= 0) return d.replace(formatKey, allowedFormats[formatKey]());
      return d;
    }, format);
  };

  Date.prototype.timeDiff = function (futureDateMilliseconds, format) {
    const currentTime = this.getTime();
    if (futureDateMilliseconds instanceof Date) {
      return parseSymbols(futureDateMilliseconds.getTime() - currentTime, format);
    }

    return parseSymbols(futureDateMilliseconds - currentTime, format);
  };

  Date.prototype.timeAgo = function (pastDateMilliseconds, symbols) {
    const currentTime = this.getTime();
    const names = {
      '%d': 'day',
      '%h': 'hour',
      '%n': 'minute',
      '%s': 'second'
    };
    let replacedString;
    if (pastDateMilliseconds instanceof Date) {
      replacedString = parseSymbols(
        currentTime - pastDateMilliseconds.getTime(),
        symbols.join('|')
      ).split('|');
    } else {
      replacedString = parseSymbols(
        currentTime - pastDateMilliseconds,
        symbols.join('|')
      ).split('|');
    }

    return symbols.reduce((compiled, key, i) => {
      const value = parseInt(replacedString[i]);
      const nameKey = key.toLowerCase();
      if (value === 0 || names[nameKey] === undefined) return compiled;
      const str = compiled? compiled + ' ' : '';
      if (value === 1) return str + replacedString[i] + ' ' + names[nameKey];
      return str + replacedString[i] + ' ' + names[nameKey] + 's';
    }, null) + ' ago';
  };
})();