import '../lib';

const current = new Date('July 2, 2017 02:03:05');
const future = new Date('July 10, 2017 12:10:08');
const past = new Date('June 27, 2017 09:10:24');

describe('timeDiff', () => {
  test('displays zeros when time has past', () => {
    expect(future.timeDiff(current, '%D %H %N %S')).toEqual('00 00 00 00');
    expect(future.timeDiff(current, '%D %H %N')).toEqual('00 00 00');
    expect(future.timeDiff(current, '%D')).toEqual('00');
    expect(future.timeDiff(current.getTime(), '%D %H %N %S')).toEqual('00 00 00 00');
    expect(future.timeDiff(current.getTime(), '%D %H %N')).toEqual('00 00 00');
    expect(future.timeDiff(current.getTime(), '%D')).toEqual('00');
  });
  test('displays time remaining', () => {
    expect(current.timeDiff(future, '%D %H %N %S')).toEqual('08 22 07 03');
    expect(current.timeDiff(future.getTime(), '%D %H %N %S')).toEqual('08 22 07 03');
  });
  test('displays time past', () => {
    expect(past.timeDiff(current, '%D %H %N %S')).toEqual('04 52 52 41');
    expect(past.timeDiff(current.getTime(), '%D %H %N %S')).toEqual('04 52 52 41');
  });
});