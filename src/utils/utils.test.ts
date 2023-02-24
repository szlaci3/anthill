import {
  isUrl,
  hasVal,
  toArrayIfPossible,
  to0_2Dec,
  toPercent,
  toPercent0_4Dec,
  toPercent2_4Dec
} from './utils';

describe('isUrl tests', () => {
  it('should return false for invalid and corner case inputs', () => {
    expect(isUrl([] as any)).toBeFalsy();
    expect(isUrl({} as any)).toBeFalsy();
    expect(isUrl(false as any)).toBeFalsy();
    expect(isUrl(true as any)).toBeFalsy();
    expect(isUrl(NaN as any)).toBeFalsy();
    expect(isUrl(null as any)).toBeFalsy();
    expect(isUrl(undefined as any)).toBeFalsy();
    expect(isUrl('')).toBeFalsy();
  });

  it('should return false for invalid URLs', () => {
    expect(isUrl('foo')).toBeFalsy();
    expect(isUrl('bar')).toBeFalsy();
    expect(isUrl('bar/test')).toBeFalsy();
    expect(isUrl('http:/example.com/')).toBeFalsy();
    expect(isUrl('ttp://example.com/')).toBeFalsy();
  });

  it('should return true for valid URLs', () => {
    expect(isUrl('http://example.com/')).toBeTruthy();
    expect(isUrl('https://example.com/')).toBeTruthy();
    expect(isUrl('http://example.com/test/123')).toBeTruthy();
    expect(isUrl('https://example.com/test/123')).toBeTruthy();
    expect(isUrl('http://example.com/test/123?foo=bar')).toBeTruthy();
    expect(isUrl('https://example.com/test/123?foo=bar')).toBeTruthy();
    expect(isUrl('http://www.example.com/')).toBeTruthy();
    expect(isUrl('https://www.example.com/')).toBeTruthy();
    expect(isUrl('http://www.example.com/test/123')).toBeTruthy();
    expect(isUrl('https://www.example.com/test/123')).toBeTruthy();
    expect(isUrl('http://www.example.com/test/123?foo=bar')).toBeTruthy();
    expect(isUrl('https://www.example.com/test/123?foo=bar')).toBeTruthy();
  });
});

  /* Mine */

describe('hasVal tests', () => {
  test('hasVal returns true if argument has value', () => {
    expect(hasVal(0)).toBeTruthy();
    expect(hasVal(1)).toBeTruthy();
    expect(hasVal(NaN)).toBeTruthy();
    expect(hasVal(9/0)).toBeTruthy();
    expect(hasVal({})).toBeTruthy();
    expect(hasVal([])).toBeTruthy();
    expect(hasVal(() => {})).toBeTruthy();
    expect(hasVal("")).toBeTruthy();
    expect(hasVal(false)).toBeTruthy();
  });

  test('hasVal returns false if argument has no value', () => {
    expect(hasVal(undefined)).toBeFalsy();
    expect(hasVal(null)).toBeFalsy();
    expect(hasVal()).toBeFalsy();
    expect(hasVal(window.fictiveVariable)).toBeFalsy();
  });
});

describe('toArrayIfPossible tests', () => {
  test('toArrayIfPossible runs properly', () => {
    let arr1 = [];
    expect(toArrayIfPossible(arr1)).toEqual(arr1);
    let arr2 = [1, 2];
    expect(toArrayIfPossible(arr2)).toEqual(arr2);

    let arr3 = [{a: 1, b: [{c: null}]}, 2];
    expect(toArrayIfPossible(arr3)).toEqual(arr3);
    let value4 = {0: {a: 1, b: {0: {c: null}}}, 1: 2};
    expect(toArrayIfPossible(value4)).toEqual(arr3);// arr3 is the array version of value4 object

    let value5 = {};
    expect(toArrayIfPossible(value5)).toEqual([]);
    let value6 = {a: 1};
    expect(toArrayIfPossible(value6)).toEqual(value6);
    let value7 = "abc";
    expect(toArrayIfPossible(value7)).toEqual(value7);
    let value8 = null;
    expect(toArrayIfPossible(value8)).toEqual([]);
    let value9 = [null];
    expect(toArrayIfPossible(value9)).toEqual(value9);
  });

  test('toArrayIfPossible keeps legth of array even if items are undefined', () => {
    let value1 = [];
    value1[4] = "Hello";
    expect(toArrayIfPossible(value1)).toEqual(value1);

    let value2 = Array(6);
    expect(toArrayIfPossible(value2)).toEqual(value2);
  });
});

let sample0 = .005;
let sample1 = 3.0051;
let sample2 = 3.005;
let sample3 = 3.00999;
let sample4 = .50999;
let sample5 = NaN;
let sample6 = " ";

describe('to0_2Dec tests', () => {
  test('to0_2Dec runs properly', () => {
    expect(to0_2Dec(sample0)).toEqual("0.01");
    expect(to0_2Dec(sample1)).toEqual("3.01");
    expect(to0_2Dec(sample2)).toEqual("3");
    expect(to0_2Dec(sample3, "floor")).toEqual("3");
    expect(to0_2Dec(sample4, "floor")).toEqual("0.5");
    expect(to0_2Dec(sample5, "floor")).toEqual("");
    expect(to0_2Dec(sample6, "floor")).toEqual(sample6);
  });
});

describe('toPercent tests', () => {
  test('toPercent runs properly', () => {
    expect(toPercent(sample0)).toEqual("0.50%");
    expect(toPercent(sample1)).toEqual("300.51%");
    expect(toPercent(sample2)).toEqual("300.50%");
    expect(toPercent(sample3)).toEqual("301.00%");
    expect(toPercent(sample4)).toEqual("51.00%");
    expect(toPercent(sample5)).toEqual("");
    expect(toPercent(sample6)).toEqual(sample6);
  });
});

describe('toPercent0_4Dec tests', () => {
  test('toPercent0_4Dec runs properly', () => {
    expect(toPercent0_4Dec(sample0)).toEqual("0.5");
    expect(toPercent0_4Dec(sample1)).toEqual("300.51");
    expect(toPercent0_4Dec(sample2)).toEqual("300.5");
    expect(toPercent0_4Dec(sample3)).toEqual("300.999");
    expect(toPercent0_4Dec(sample4)).toEqual("50.999");
    expect(toPercent0_4Dec(sample5)).toEqual("");
    expect(toPercent0_4Dec(sample6)).toEqual(sample6);
  });
});

describe('toPercent2_4Dec tests', () => {
  test('toPercent2_4Dec runs properly', () => {
    expect(toPercent2_4Dec(sample0)).toEqual("0.50");
    expect(toPercent2_4Dec(sample1)).toEqual("300.51");
    expect(toPercent2_4Dec(sample2)).toEqual("300.50");
    expect(toPercent2_4Dec(sample3)).toEqual("300.999");
    expect(toPercent2_4Dec(sample4)).toEqual("50.999");
    expect(toPercent2_4Dec(sample5)).toEqual("");
    expect(toPercent2_4Dec(sample6)).toEqual(sample6);
  });
});
