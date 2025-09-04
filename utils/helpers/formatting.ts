import moment from 'moment';

export const formatDate = (date: Date, format: string = 'YYYY-MM-DD'): string => {
  return moment(date).format(format);
};

export const formatTime = (date: Date, format: string = 'HH:mm:ss'): string => {
  return moment(date).format(format);
};

export const formatDateTime = (date: Date, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  return moment(date).format(format);
};

export const formatToDate = (date: string): Date => {
  return moment(date, 'YYYY-MM-DD').toDate();
};

export const formatToDateTime = (date: string): Date => {
  return moment(date, 'YYYY-MM-DD HH:mm:ss').toDate();
};

export const formatToTime = (date: string): Date => {
  return moment(date, 'HH:mm:ss').toDate();
};

export const formatAsRelativeTime = (date: Date): string => {
  return moment(date).fromNow();
};

export const formatAsCalendarTime = (date: Date): string => {
  return moment(date).calendar();
};
