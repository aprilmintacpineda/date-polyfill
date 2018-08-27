import '../lib';

const current = new Date('July 2, 2018 02:03:05');
const past = new Date('June 27, 2017 09:10:24');

describe('timeAgo', () => {
  test('it displays the time ago', () => {
    expect(current.timeAgo(past, ['%Y', '%D', '%H', '%N', '%S'])).toEqual('01 year 04 days 52 hours 52 minutes 41 seconds ago');
    expect(current.timeAgo(past.getTime(), ['%Y', '%D', '%H', '%N', '%S'])).toEqual('01 year 04 days 52 hours 52 minutes 41 seconds ago');

    expect(current.timeAgo(past, ['%y', '%d', '%h', '%n', '%s'])).toEqual('1 year 4 days 52 hours 52 minutes 41 seconds ago');
    expect(current.timeAgo(past.getTime(), ['%y', '%d', '%h', '%n', '%s'])).toEqual('1 year 4 days 52 hours 52 minutes 41 seconds ago');
  });
  test('it removes the zeros', () => {
    const past1 = new Date('July 1, 2018 02:03:04');
    expect(current.timeAgo(past1, ['%Y', '%D', '%H', '%N', '%S'])).toEqual('01 day 24 hours 01 second ago');
    expect(current.timeAgo(past1.getTime(), ['%Y', '%D', '%H', '%N', '%S'])).toEqual('01 day 24 hours 01 second ago');

    expect(current.timeAgo(past1, ['%d', '%h', '%n', '%s'])).toEqual('1 day 24 hours 1 second ago');
    expect(current.timeAgo(past1.getTime(), ['%d', '%h', '%n', '%s'])).toEqual('1 day 24 hours 1 second ago');
  });
  test('when time ago is null', () => {
    const past = new Date('July 1, 2018 02:03:04');
    const current = new Date('July 1, 2018 02:03:04');

    expect(current.timeAgo(past, ['%Y', '%D', '%H', '%N', '%S'])).toEqual('00 seconds ago');
    expect(current.timeAgo(past, ['%Y', '%D', '%H', '%N'])).toEqual('00 minutes ago');
    expect(current.timeAgo(past, ['%Y', '%D', '%H'])).toEqual('00 hours ago');
    expect(current.timeAgo(past, ['%Y', '%D'])).toEqual('00 days ago');
    expect(current.timeAgo(past, ['%Y'])).toEqual('00 years ago');

    expect(current.timeAgo(past, ['%y', '%d', '%h', '%n', '%s'])).toEqual('0 seconds ago');
    expect(current.timeAgo(past, ['%y', '%d', '%h', '%n'])).toEqual('0 minutes ago');
    expect(current.timeAgo(past, ['%y', '%d', '%h'])).toEqual('0 hours ago');
    expect(current.timeAgo(past, ['%y', '%d'])).toEqual('0 days ago');
    expect(current.timeAgo(past, ['%y'])).toEqual('0 years ago');

    expect(current.timeAgo(past, ['%y', '%d', '%s', '%h', '%n'])).toEqual('0 seconds ago');
    expect(current.timeAgo(past, ['%y', '%n', '%d', '%h'])).toEqual('0 minutes ago');
    expect(current.timeAgo(past, ['%y', '%h', '%d'])).toEqual('0 hours ago');
    expect(current.timeAgo(past, ['%d', '%y'])).toEqual('0 days ago');
    expect(current.timeAgo(past, ['%y'])).toEqual('0 years ago');
  });
});