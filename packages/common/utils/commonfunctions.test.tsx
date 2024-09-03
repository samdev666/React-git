import moment from 'moment';
import {
  convertIsoDatoToIsoDateTime,
  convertToIsoDateTime,
  convertToIsoDate,
  isUndefined,
  isNull,
  getApiDate,
  convertToMomentDate,
  getEditUrl,
  convertSingleToDoubleDigit,
} from './commonFunctions';

describe('convertIsoDatoToIsoDateTime', () => {
  it('should convert ISO date to ISO date-time format', () => {
    const mockFormat = jest.fn(() => '12:34:56Z');
    jest.spyOn(moment.prototype, 'format').mockImplementation(mockFormat);

    const isoDate = '2022-01-30';
    const isoDateTime = convertIsoDatoToIsoDateTime(isoDate);

    expect(isoDateTime).toMatch(/^2022-01-30T\d{2}:\d{2}:\d{2}Z$/);

    expect(mockFormat).toHaveBeenCalledWith('HH:mm:ssZ');

    jest.restoreAllMocks();
  });
});

describe('convertToIsoDateTime', () => {
  it('should convert date to ISO date-time format', () => {
    const date = '2022-01-30';
    const isoDateTime = convertToIsoDateTime(date);

    expect(isoDateTime).toBe('2022-01-30T00:00:00+05:30');
  });

  it('should return undefined for empty string input', () => {
    const isoDateTime = convertToIsoDateTime('');
    expect(isoDateTime).toBeUndefined();
  });
});

describe('convertToIsoDate', () => {
  it('should convert date to ISO date format', () => {
    jest.mock('moment', () => {
      const m = jest.fn(() => ({
        format: jest.fn().mockReturnValue('2022-01-30'),
      }));
      return m;
    });

    const date = '2022-01-30';
    const isoDate = convertToIsoDate(date);

    expect(isoDate).toBe('2022-01-30');

    jest.restoreAllMocks();
  });
});

describe('isUndefined', () => {
  it('should return false for a defined value', () => {
    const result = isUndefined('someValue');
    expect(result).toBe(false);
  });
});

describe('isNull', () => {
  it('should return true for null', () => {
    const result = isNull(null);
    expect(result).toBe(true);
  });

  it('should return false for a defined value', () => {
    const result = isNull('someValue');
    expect(result).toBe(false);
  });
});

describe('getApiDate', () => {
  it('should return null for null input', () => {
    const result = getApiDate(null);
    expect(result).toBe(null);
  });

  it('should return undefined for undefined input', () => {
    const result = getApiDate(undefined);
    expect(result).toBe(undefined);
  });

  it('should convert string to ISO date', () => {
    const stringValue = '2022-01-30';
    const result = getApiDate(stringValue);
    const expected = convertToIsoDate(stringValue);
    expect(result).toBe(expected);
  });
});

describe('convertToMomentDate', () => {
  it('should return null for null input', () => {
    const result = convertToMomentDate(null);
    expect(result).toBe(null);
  });

  it('should return undefined for undefined output', () => {
    const result = convertToMomentDate(undefined);
    expect(result).toBe(undefined);
  });

  it('should convert string to moment object', () => {
    const stringValue = '2022-01-30';
    const result = convertToMomentDate(stringValue);
    const expected = moment(stringValue);
    expect(result).toEqual(expected);
  });

  it('should return moment object unchanged', () => {
    const momentValue = moment('2022-01-30');
    const result = convertToMomentDate(momentValue);
    expect(result).toEqual(momentValue);
  });
});

describe('getEditUrl', () => {
  it('should replace :id in route with entity id', () => {
    const route = '/edit/:id';
    const entity = { id: 123 };
    const result = getEditUrl(route)(entity);
    const expected = '/edit/123';
    expect(result).toBe(expected);
  });
});

describe('convertSingleToDoubleDigit', () => {
  it('should convert single-digit number to double-digit string', () => {
    const result = convertSingleToDoubleDigit(5);
    const expected = '05';
    expect(result).toBe(expected);
  });

  it('should handle zero as double-digit string', () => {
    const result = convertSingleToDoubleDigit(0);
    const expected = '00';
    expect(result).toBe(expected);
  });

  it('should handle double-digit number as string', () => {
    const result = convertSingleToDoubleDigit(42);
    const expected = '42';
    expect(result).toBe(expected);
  });
});
