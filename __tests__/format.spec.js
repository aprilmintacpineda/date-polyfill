import '../lib';

const date = new Date('July 2, 2017 02:03:05');

describe('Format', () => {
  describe('it recognizes symbols', () => {
    test('year', () => {
      expect(date.format('%y')).toEqual('2017');
      expect(date.format('%Y')).toEqual('17');
    });
    test('month', () => {
      expect(date.format('%m')).toEqual('7');
      expect(date.format('%M')).toEqual('07');
    });
    test('date', () => {
      expect(date.format('%d')).toEqual('2');
      expect(date.format('%D')).toEqual('02');
    });
    test('hour', () => {
      expect(date.format('%h')).toEqual('2');
      expect(date.format('%H')).toEqual('02');
      expect(date.format('%i')).toEqual('2');
      expect(new Date('July 2, 2017 21:03:05').format('%I')).toEqual('21');
    });
    test('minute', () => {
      expect(date.format('%n')).toEqual('3');
      expect(date.format('%N')).toEqual('03');
    });
    test('seconds', () => {
      expect(date.format('%s')).toEqual('5');
      expect(date.format('%S')).toEqual('05');
    });
  });

  describe('hour return 12 when hour <= 12', () => {
    test('%H', () => {
      const date2 = new Date('July 2, 2017 12:03:05 PM');
      const date3 = new Date('July 2, 2017 12:03:05 AM');
      expect(date2.format('%H')).toEqual('12');
      expect(date3.format('%H')).toEqual('12');
    });
    test('%h', () => {
      const date2 = new Date('July 2, 2017 12:03:05 PM');
      const date3 = new Date('July 2, 2017 12:03:05 AM');
      expect(date2.format('%h')).toEqual('12');
      expect(date3.format('%h')).toEqual('12');
    });
  });

  describe('it combines symbols', () => {
    test('%f %D, %y', () => {
      expect(date.format('%f %D, %y')).toEqual('July 02, 2017');
    });
    test('%M-%D-%y', () => {
      expect(date.format('%M-%D-%y')).toEqual('07-02-2017');
    });
    test('%M/%D/%Y', () => {
      expect(date.format('%M/%D/%Y')).toEqual('07/02/17');
    });
    test('%f %D, %y %H:%N:%S %a', () => {
      expect(date.format('%f %D, %y %H:%N:%S %a')).toEqual('July 02, 2017 02:03:05 AM');
      expect(new Date('July 2, 2017 21:03:05').format('%f %D, %y %H:%N:%S %a')).toEqual('July 02, 2017 09:03:05 PM');
    });
    test('%f %D, %y %I:%N:%S', () => {
      expect(date.format('%f %D, %y %I:%N:%S')).toEqual('July 02, 2017 02:03:05');
      expect(new Date('July 2, 2017 21:03:05').format('%f %D, %y %I:%N:%S')).toEqual('July 02, 2017 21:03:05');
    });
  });
});