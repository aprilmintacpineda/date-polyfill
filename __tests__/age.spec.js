/** @format */

import '../lib';

describe('age', () => {
  test('gives correct year when NOW date specified', () => {
    expect(new Date('February 9, 1995').age()).toEqual(23);
  });
  test('gives correct year when NOW is specified', () => {
    expect(new Date('February 9, 1995').age(new Date('August 27, 2000'))).toEqual(5);
    expect(new Date('February 9, 1995').age(new Date('January 10, 1996'))).toEqual(0);
    expect(new Date('February 9, 1995').age(new Date('February 8, 1995'))).toEqual(0);
    expect(new Date('February 9, 1995').age(new Date('February 9, 1995'))).toEqual(1);
    expect(new Date('February 9, 1995').age(new Date('February 10, 1995'))).toEqual(1);
  });
});
