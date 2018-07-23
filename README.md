# date-polyfill.js

A lightweight (2.4K, minified) polyfill for rich date features.

## Usage

`npm install --save date-polyfill`

Then add the following before your other codes.

```jsx
import 'date-polyfill';
// or
require('date-polyfill');
```

## Table of symbols

The following symbols are used throughout the operations.

|Symbol|Explanation|Example
|---|---|---|
|`%a`|**AM**/**PM**.
|`%y`|The **entire year**.|`2018`
|`%Y`|The **shortened year**.|`2018` => `18`
|`%D`|The **date** prefixed with `0`.|`02`, `17`
|`%d`|The **date** without the prefixed `0`.|`2`, `17`
|`%D`@`timeDiff` method|The number of days prefixed with `0`.|`02`, `17`
|`%d`@`timeDiff` method|The number of days without the prefixed `0`.|`2`, `17`
|`%M`|The **month** prefixed with `0`.|`02`, `10`
|`%m`|The **month** without the prefixed `0`.|`2`, `10`.
|`%f`|The **full month name**.|`January`
|`%F`|The **Shortened month name**.|`Jan`
|`%w`|The **full week name**.|`Monday`
|`%W`|The **shortened week name**.|`Mon`
|`'%I'` (uppercase letter `i`)|The **hour** in 24 hour format prefixed with `0`.|`13`, `1`
|`'%i'`|The **hour** in 24 hour format without the prefixed `0`.|`13`, `1`
|`%H`|The **hour** in 12 hour format prefixed with `0`.|`08`, `12`
|`%h`|The **hour** in 12 hour format without the prefixed `0`.|`8`, `12`
|`%N`|The **minute** prefixed with `0`.|`02`,`24`
|`%n`|The **minute** without the prefixed `0`.|`2`, `24`
|`%S`|The **seconds** prefixed with `0`|`02`, `24`
|`%s`|The **seconds** without the prefixed `0`|`2`, `24`

## Features

The polyfill uses the `Date.prototype` so it basically extends the `Date` object and can be used with it.

#### Formatting dates using `format` method.

```jsx
const formattedDate = new Date(1532255320521).format('%f %D, %y');
// Output: July 22, 2018
```

The `format` method on the Date object will accept a string, which is the format with the **symbols**, as it's only argument. Please refer to the **table of symbols**.

You can provide whatever format you like, you just need to specify the correct symbol on where you want them to be.

###### Example formats

```
'%f %D, %y'
'%m-%d-%y'
'%M-%D-%Y'
'%M-%D-%Y'
'%M-%D-%Y %H:%N:%S'
'%M-%D-%Y %h:%n:%s'
'%M-%D-%Y %i:%n:%s'
'%M-%D-%Y %I:%N:%S'
'%F %M, %Y %I:%N:%S'
```

#### Getting time remaining and time past using `timeDiff` method.

The `timeDiff` method allows you to display the difference between two `datetime`. Allowing you to display a countdown timer or a past time timer.

```jsx
const current = new Date(1532258235447); // Jul 22 2018 19:17:15
const future = new Date(1534245435447); // Aug 14 2018 19:17:15
const past = new Date(1530271035447); // Jun 29 2018 19:17:15

console.log('time remaining:', current.timeDiff(future, '%D %H %N %S')); // time remaining: 23 12 00 00
console.log('time past:', past.timeDiff(current, '%D %H %N %S')); // time past: 23 12 00 00
```

Here you see that the **time past** and **time remaining** are the same but the difference is that the **time past** is counting **up** so the time _increases_ every seconds while the **time remaining** is counting **down** so the time _decreases_ every seconds. They simply looked a like because I used fixed unix time but if you use `Date.now()` you'll see how different they are.

The `timeDiff` accepts two arguments.

1. `Milliseconds : integer` or the `new Date()` object.
2. `Format : string`. Refer to the `format` method and **table of symbols**.

To get the **time remaining**, you provide a `future date` (bigger milliseconds) to a `date` (smaller milliseconds).

To get the time past, you provide a `date` (bigger milliseconds) to a `past date` (smaller milliseconds).

If you happen to provide a date that has past, i.e. **smaller milliseconds** (minus) **bigger milliseconds**, you'll get zeros. E.g.

```jsx
console.log('time remaining (negative):', future.timeDiff(current, '%D %H %N %S')); // 00 00 00 00
```

#### Getting _time ago_ using `timeAgo` method.

Like the `timeDiff`, the `timeAgo` counts **up**. So the time past increases every seconds.

```
const current = new Date(1532258235447); // Jul 22 2018 19:17:15
const past = new Date(1530271035447); // Jun 29 2018 19:17:15

console.log('time ago:', current.timeAgo(past, ['%d', '%h', '%n', '%s'])); // time ago: 23 days 12 hours ago
```

The `timeAgo` method accepts two arguments.

1. `millseconds : integer` or `new Date()` object.
2. `symbols : array`. Which is the symbols you want to get, in the case above we wanted to get the `days`, `hours`, `minutes`, and `seconds`. Please refer to the **table of symbols**

Basically it's like saying _"from this point in time, tell me how much time past since this point in time"_.

##### Important notes

- In the this method, the only supported symbols are the `days`, `hours`, `minutes`, and `seconds`.

I'd like to add support for `month` and `year` but computing for those would be tricky because the number of days in a month depends on the month and the year (leap year). The number of days in year also depends if it's leap year. Until I can find a reliable solution that works for every situation, there wouldn't be any support for `month` and `year`.

## Contributing

Please feel free to open an issue if you have any questions, clarifications, feature requests, bug reports, or things you want to point out.

## License

[MIT](https://github.com/aprilmintacpineda/date-polyfill/blob/master/LICENSE).

**Created with ❤️ by April Mintac Pineda**