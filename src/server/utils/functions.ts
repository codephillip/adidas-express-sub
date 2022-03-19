import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const createErrorResponse = (statusCode: number, type: string, param: string, message: string) => ({
  status_code: statusCode,
  type,
  param,
  message,
});

const createSuccessResponse = (statusCode: number, data: Object) => ({
  status_code: statusCode,
  data,
});

const getRandomValueFromArray = <Type>(arr: Type[]) => arr[Math.floor(Math.random() * arr.length)];

const dateToUTC = (date: Date) => dayjs.utc(date);

const getAge = birthDate => {
  const now = new Date();
  const isLeap = year => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

  let days = Math.floor((now.getTime() - birthDate.getTime()) / 1000 / 60 / 60 / 24);
  let age = 0;
  for (let y = birthDate.getFullYear(); y <= now.getFullYear(); y++) {
    const daysInYear = isLeap(y) ? 366 : 365;
    if (days >= daysInYear) {
      days -= daysInYear;
      age++;
    }
  }
  return age;
};

export { createErrorResponse, createSuccessResponse, getRandomValueFromArray, dateToUTC, getAge };
