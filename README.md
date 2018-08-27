<!-- @format -->

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

| Symbol                        | Explanation                                              | Example        |
| ----------------------------- | -------------------------------------------------------- | -------------- |
| `%a`                          | **AM**/**PM**.                                           |
| `%y`                          | The **entire year**.                                     | `2018`         |
| `%Y`                          | The **shortened year**.                                  | `2018` => `18` |
| `%D`                          | The **date** prefixed with `0`.                          | `02`, `17`     |
| `%d`                          | The **date** without the prefixed `0`.                   | `2`, `17`      |
| `%D`@`timeDiff` method        | The number of **days** prefixed with `0`.                | `02`, `17`     |
| `%d`@`timeDiff` method        | The number of **days** without the prefixed `0`.         | `2`, `17`      |
| `%M`                          | The **month** prefixed with `0`.                         | `02`, `10`     |
| `%m`                          | The **month** without the prefixed `0`.                  | `2`, `10`.     |
| `%f`                          | The **full month name**.                                 | `January`      |
| `%F`                          | The **Shortened month name**.                            | `Jan`          |
| `%w`                          | The **full week name**.                                  | `Monday`       |
| `%W`                          | The **shortened week name**.                             | `Mon`          |
| `'%I'` (uppercase letter `i`) | The **hour** in 24 hour format prefixed with `0`.        | `13`, `1`      |
| `'%i'`                        | The **hour** in 24 hour format without the prefixed `0`. | `13`, `1`      |
| `%H`                          | The **hour** in 12 hour format prefixed with `0`.        | `08`, `12`     |
| `%h`                          | The **hour** in 12 hour format without the prefixed `0`. | `8`, `12`      |
| `%N`                          | The **minute** prefixed with `0`.                        | `02`,`24`      |
| `%n`                          | The **minute** without the prefixed `0`.                 | `2`, `24`      |
| `%S`                          | The **seconds** prefixed with `0`                        | `02`, `24`     |
| `%s`                          | The **seconds** without the prefixed `0`                 | `2`, `24`      |

## API

The polyfill uses the `Date.prototype` so it basically extends the `Date` object and can be used with it.

###### Notes

- The behaviour of `%D` changes depending if `%Y` or `%y` is present.

#### Formatting dates: format(formatString)

###### Parameters

1. **Required** `formatString : string`. The string format.

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

#### Getting time remaining and time past: timeDiff(Date, formatString)

###### Notes

- This method does not support the symbol `%m | %M` yet.

###### Parameters

1. **Required** `Milliseconds : Date.now() | new Date()` object.
2. **Required** `Format : string`. Refer to the `format` method and **table of symbols**.

The `timeDiff` method allows you to display the difference between two `datetime`. Allowing you to display a countdown timer or a past time timer.

```js
const current = new Date(1532258235447); // Jul 22 2018 19:17:15
const future = new Date(1534245435447); // Aug 14 2018 19:17:15
const past = new Date(1530271035447); // Jun 29 2018 19:17:15

console.log('time remaining:', current.timeDiff(future, '%D %H %N %S')); // time remaining: 23 12 00 00
console.log('time past:', past.timeDiff(current, '%D %H %N %S')); // time past: 23 12 00 00

// new Date(-1) would return Thu Jan 01 1970 07:59:59 GMT+0800
// compute time passed since Thu Jan 01 1970 07:59:59 GMT+0800 to the datetime I was writing time
console.log(
  'time past (with year):',
  new Date(-1).timeDiff(new Date('Mon Aug 27 2018 14:44:18'), '%Y %D %H %N %S')
); // 48 250 06 44 18

console.log(
  'time past (with year):',
  new Date(-1).timeDiff(new Date('Mon Aug 27 2018 14:44:18'), '%D %H %N %S')
); // 17,770 06 44 18
```

Here you see that the **time past** and **time remaining** are the same but the difference is that the **time past** is counting **up** so the time _increases_ every seconds while the **time remaining** is counting **down** so the time _decreases_ every seconds. They simply looked a like because I used fixed unix time but if you use `Date.now()` you'll see how different they are.

To get the **time remaining**, you provide a `future date` (bigger milliseconds) to a `date` (smaller milliseconds).

To get the time past, you provide a `date` (bigger milliseconds) to a `past date` (smaller milliseconds).

If you happen to provide a date that has past, i.e. **smaller milliseconds** (minus) **bigger milliseconds**, you'll get zeros. E.g.

```jsx
console.log('time remaining (negative):', future.timeDiff(current, '%D %H %N %S')); // 00 00 00 00
```

#### Getting time ago: timeAgo(Date, Symbols)

###### Parameters

1. **Required** `millseconds: Date.now() | new Date()`. The past.
2. **Required** `symbols : array`. Which is the symbols you want to get, in the case above we wanted to get the `days`, `hours`, `minutes`, and `seconds`. Please refer to the **table of symbols**

Like the `timeDiff`, the `timeAgo` counts **up**. So the time past increases every seconds.

```js
const past = new Date(1532258235447); // Jul 22 2018 19:17:15
const current = new Date(1782680641000); // Jun 29 2026 05:04:01

console.log('time ago (with year):', current.timeAgo(past, ['%y', '%d', '%h', '%n', '%s'])); // 8 years 343 days 21 hours 46 minutes 45 seconds ago
console.log('time ago (without year):', current.timeAgo(past, ['%d', '%h', '%n', '%s'])); // 2,898 days 21 hours 46 minutes 45 seconds ago
```

Basically it's like saying _"from this point in time, tell me how much time past since this point in time"_.

#### The `age` method: age([Date])

###### Parameters

1. **Optional** `Date : Date.now() | new Date()`. The relative date. Defaults to `Date.now()`.

The `age` method is useful when you want to get the age of a particular person using his/her birthdate.

```js
console.log('age:', new Date('February 9, 1995').age()); // 23 as of the date of writing
console.log('age:', new Date('February 9, 1995').age(new Date('February 9, 2000'))); // 5 as of the date of writing
```

## Contributing

Please feel free to open an issue if you have any questions, clarifications, feature requests, bug reports, or things you want to point out.

## License

[MIT](https://github.com/aprilmintacpineda/date-polyfill/blob/master/LICENSE).

**Created with ❤️ by April Mintac Pineda**
