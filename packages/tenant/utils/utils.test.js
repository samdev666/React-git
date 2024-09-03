import moment from 'moment';
import {
  convertIsoDatoToIsoDateTime,
  convertToIsoDateTime,
  convertToIsoDate,
  getApiDate,
  convertToMomentDate,
  getEditUrl,
  fileSizeCheckFunction,
  convertSingleToDoubleDigit,
  capitalizeLegend,
} from './commonFunctions';

describe('Utility Functions', () => {
  it('convertIsoDatoToIsoDateTime should format date with time', () => {
    const result = convertIsoDatoToIsoDateTime('2023-11-07');
    expect(result).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}/);
  });

  it('convertToIsoDateTime should format date with time', () => {
    const result = convertToIsoDateTime('2023-11-07');
    expect(result).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}/);
  });

  it('convertToIsoDate should format date without time', () => {
    const result = convertToIsoDate('2023-11-07T12:34:56Z');
    expect(result).toBe('2023-11-07');
  });

  // Add more test cases for other functions

  describe('getApiDate Function', () => {
    it('should return null when the input is null', () => {
      const result = getApiDate(null);
      expect(result).toBeNull();
    });

    it('should return undefined when the input is undefined', () => {
      const result = getApiDate(undefined);
      expect(result).toBeUndefined();
    });

    it('should convert a moment object to an ISO date string', () => {
      const date = moment('2023-11-07T12:34:56Z');
      const result = getApiDate(date);
      expect(result).toBe('2023-11-07'); // Adjust the expected value accordingly
    });

    it('should convert a string to an ISO date string', () => {
      const dateString = '2023-11-07T12:34:56Z';
      const result = getApiDate(dateString);
      expect(result).toBe('2023-11-07'); // Adjust the expected value accordingly
    });

    // Add more test cases as needed for other scenarios
  });
  describe('convertToMomentDate Function', () => {
    it('should return null when the input is null', () => {
      const result = convertToMomentDate(null);
      expect(result).toBeNull();
    });

    it('should return undefined when the input is undefined', () => {
      const result = convertToMomentDate(undefined);
      expect(result).toBeUndefined();
    });

    it('should convert a string to a moment object', () => {
      const dateString = '2023-11-07T12:34:56Z';
      const result = convertToMomentDate(dateString);

      // Use moment's `isMoment` function to check if the result is a moment object
      expect(moment.isMoment(result)).toBe(true);
    });

    it('should return a moment object unchanged', () => {
      const date = moment('2023-11-07T12:34:56Z');
      const result = convertToMomentDate(date);

      // Use moment's `isSame` function to compare moments
      expect(date.isSame(result)).toBe(true);
    });

    // Add more test cases as needed for other scenarios
  });

  describe('getEditUrl Function', () => {
    it('should replace ":id" with entity id in the route', () => {
      const route = '/edit/:id';
      const entity = { id: 123 };
      const result = getEditUrl(route)(entity);
      expect(result).toBe('/edit/123');
    });

    it('should handle undefined entity id', () => {
      const route = '/edit/:id';
      const entity = { id: undefined };
      const result = getEditUrl(route)(entity);
      expect(result).toBe('/edit/undefined');
    });
  });

  describe('fileSizeCheckFunction Function', () => {
    it('should return true if file size is greater or equal to the acceptedFileSize', () => {
      const fileSize = fileSizeCheckFunction(1024 * 1024 * 1024, 2);
      expect(fileSize).toBe(true);
    });
    it('should return false if file size is less than the acceptedFileSize', () => {
      const fileSize = fileSizeCheckFunction(1024 * 1024, 2);
      expect(fileSize).toBe(false);
    });
  });

  describe('convertSingleToDoubleDigit function', () => {
    it('should return null when the passed value is null', () => {
      const value = convertSingleToDoubleDigit(null);
      expect(value).toBeNull();
    });
    it('should return undefined when the passed value is undefined', () => {
      const value = convertSingleToDoubleDigit(undefined);
      expect(value).toBeUndefined();
    });
    it('should return double digit when the passed value is between 0 and 9', () => {
      const value = convertSingleToDoubleDigit(5);
      expect(value).toEqual('05');
    });
    it('should return double digit when the passed value is greater than 9', () => {
      const value = convertSingleToDoubleDigit(25);
      expect(value).toEqual('25');
    });
  });

  describe('capitalizeLegend function', () => {
    it('should return null when the passed value is null', () => {
      const value = capitalizeLegend(null);
      expect(value).toBeNull();
    });
    it('should return undefined when the passed value is undefined', () => {
      const value = capitalizeLegend(undefined);
      expect(value).toBeUndefined();
    });
    it('should return string the capitalized string when the passed value is string', () => {
      const value = capitalizeLegend('test');
      expect(value).toBe('Test');
    });
    it('should return string the capitalized string with punctuations removed when the passed value is string', () => {
      const value = capitalizeLegend('test_test');
      expect(value).toBe('Test test');
    });
  });
});
