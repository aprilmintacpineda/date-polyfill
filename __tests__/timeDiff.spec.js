/** @format */

import '../lib';

const current = new Date('July 2, 2017 02:03:05');
const future = new Date('July 10, 2017 12:10:08');
const nearFuture = new Date('July 10, 2018 12:10:08');
const farFuture = new Date('July 10, 2026 12:10:08');
const past = new Date('June 27, 2017 09:10:24');

describe('timeDiff', () => {
  test('displays zeros when time has past', () => {
    expect(future.timeDiff(current, '%Y %D %H %N %S')).toEqual('00 00 00 00 00');
    expect(future.timeDiff(current.getTime(), '%Y %D %H %N %S')).toEqual('00 00 00 00 00');

    expect(future.timeDiff(current, '%y %d %h %n %s')).toEqual('0 0 0 0 0');
    expect(future.timeDiff(current.getTime(), '%y %d %h %n %s')).toEqual('0 0 0 0 0');
  });
  test('displays time remaining', () => {
    expect(current.timeDiff(future, '%Y %D %H %N %S')).toEqual('00 08 22 07 03');
    expect(current.timeDiff(future.getTime(), '%Y %D %H %N %S')).toEqual('00 08 22 07 03');

    expect(current.timeDiff(future, '%y %d %h %n %s')).toEqual('0 8 22 7 3');
    expect(current.timeDiff(future.getTime(), '%y %d %h %n %s')).toEqual('0 8 22 7 3');

    expect(current.timeDiff(nearFuture, '%Y %D %H %N %S')).toEqual('01 08 22 07 03');
    expect(current.timeDiff(nearFuture.getTime(), '%Y %D %H %N %S')).toEqual('01 08 22 07 03');

    expect(current.timeDiff(nearFuture, '%y %d %h %n %s')).toEqual('1 8 22 7 3');
    expect(current.timeDiff(nearFuture.getTime(), '%y %d %h %n %s')).toEqual('1 8 22 7 3');

    expect(current.timeDiff(farFuture, '%Y %D %H %N %S')).toEqual('09 10 10 07 03');
    expect(current.timeDiff(farFuture.getTime(), '%Y %D %H %N %S')).toEqual('09 10 10 07 03');

    expect(current.timeDiff(farFuture, '%y %d %h %n %s')).toEqual('9 10 10 7 3');
    expect(current.timeDiff(farFuture.getTime(), '%y %d %h %n %s')).toEqual('9 10 10 7 3');
  });
  test('displays time past', () => {
    expect(past.timeDiff(current, '%D %H %N %S')).toEqual('04 52 52 41');
    expect(past.timeDiff(current.getTime(), '%D %H %N %S')).toEqual('04 52 52 41');

    expect(past.timeDiff(current, '%d %h %n %s')).toEqual('4 52 52 41');
    expect(past.timeDiff(current.getTime(), '%d %h %n %s')).toEqual('4 52 52 41');

    expect(past.timeDiff(nearFuture, '%Y %H %N %S')).toEqual('01 14 59 44');
    expect(past.timeDiff(nearFuture.getTime(), '%Y %H %N %S')).toEqual('01 14 59 44');

    expect(past.timeDiff(nearFuture, '%y %h %n %s')).toEqual('1 14 59 44');
    expect(past.timeDiff(nearFuture.getTime(), '%y %h %n %s')).toEqual('1 14 59 44');

    // the %d considers %y so it makes adjustments accordingly
    expect(past.timeDiff(farFuture, '%Y %D %H %N %S')).toEqual('09 15 02 59 44');
    expect(past.timeDiff(farFuture.getTime(), '%Y %D %H %N %S')).toEqual('09 15 02 59 44');

    expect(past.timeDiff(farFuture, '%y %d %h %n %s')).toEqual('9 15 2 59 44');
    expect(past.timeDiff(farFuture.getTime(), '%y %d %h %n %s')).toEqual('9 15 2 59 44');

    // day should now be a lot bigger now that there's no %y present
    expect(past.timeDiff(farFuture, '%D %H %N %S')).toEqual('3300 02 59 44');
    expect(past.timeDiff(farFuture.getTime(), '%D %H %N %S')).toEqual('3300 02 59 44');

    expect(past.timeDiff(farFuture, '%d %h %n %s')).toEqual('3300 2 59 44');
    expect(past.timeDiff(farFuture.getTime(), '%d %h %n %s')).toEqual('3300 2 59 44');
  });
});
