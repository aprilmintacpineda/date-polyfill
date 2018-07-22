import '../lib';

const current = new Date('July 2, 2018 02:03:05');
const past = new Date('June 27, 2017 09:10:24');

describe('timeAgo', () => {
  test('it displays the time ago', () => {
    expect(current.timeAgo(past, ['%D', '%H', '%N', '%S'])).toEqual('369 days 52 hours 52 minutes 41 seconds ago');
    expect(current.timeAgo(past.getTime(), ['%D', '%H', '%N', '%S'])).toEqual('369 days 52 hours 52 minutes 41 seconds ago');
  });
  test('it removes the zeros', () => {
    const past1 = new Date('July 1, 2018 02:03:04');
    expect(current.timeAgo(past1, ['%d', '%h', '%n', '%s'])).toEqual('1 day 24 hours 1 second ago');
    expect(current.timeAgo(past1.getTime(), ['%d', '%h', '%n', '%s'])).toEqual('1 day 24 hours 1 second ago');
  });
});