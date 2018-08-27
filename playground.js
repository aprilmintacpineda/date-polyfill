/** @format */

require('./lib');

(function timeAgo () {
  console.log('---- timeAgo() ----');
  const past = new Date(1532258235447); // Jul 22 2018 19:17:15
  const current = new Date(1782680641000); // Jun 29 2026 05:04:01

  console.log('time ago (with year):', current.timeAgo(past, ['%y', '%d', '%h', '%n', '%s'])); // 8 years 343 days 21 hours 46 minutes 45 seconds ago
  console.log('time ago (without year):', current.timeAgo(past, ['%d', '%h', '%n', '%s'])); // 2898 days 21 hours 46 minutes 45 seconds ago
})();

(function timeDiff () {
  console.log('\n---- timeDiff() ----');
  const current = new Date('Jul 22 2018 19:17:15');
  const future = new Date('Aug 14 2018 19:17:15');
  const past = new Date('Jun 29 2018 04:05:01');

  console.log('time remaining:', current.timeDiff(future, '%D %H %N %S')); // time remaining: 23 12 00 00
  console.log('time past:', past.timeDiff(current, '%D %H %N %S')); // time past: 23 12 00 00
  console.log(
    'time past (with year):',
    new Date(-1).timeDiff(new Date('Mon Aug 27 2018 14:44:18'), '%Y %D %H %N %S')
  ); // 48 250 06 44 18
  console.log('time remaining (negative):', future.timeDiff(current, '%D %H %N %S')); // 00 00 00 00
})();

(function age () {
  console.log('\n---- age() ----');

  console.log('age:', new Date('February 9, 1995').age()); // 23
  console.log('age:', new Date('February 9, 1995').age(new Date('February 9, 2000'))); // 5
})();
