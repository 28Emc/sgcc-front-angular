
import CryptoJS from 'crypto-js';
import { DateTime } from "luxon";

export function encryptPassword(passwordText: string): string {
  return CryptoJS.SHA256(passwordText).toString(CryptoJS.enc.Hex);
}

export function extractCommaFromNumber(number: any, decimals: number = 4): number {
  try {
    let cutOff = number.toString().replace(/,/gi, '');
    return +parseFloat(cutOff).toFixed(decimals);
  } catch (error) {
    return 0;
  }
}

export function getRealDate(date?: DateTime): DateTime {
  const realDate: DateTime = date ?? DateTime.now();
  return realDate?.setLocale('es-PE').startOf('day');
}

export function formatDateWithFormats(fecha: string, initialFormat: string, finalFormat: string): string {
  return DateTime.fromFormat(fecha, initialFormat).toFormat(finalFormat);
}

export function arrayToMap(array: any[], key: string, value: string): Map<any, any> {
  return array.reduce((acc, obj) => {
    acc.set(obj[key], obj[value]);
    return acc;
  }, new Map());
}
