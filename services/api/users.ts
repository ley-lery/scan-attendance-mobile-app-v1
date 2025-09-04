import client from './client';
import { ENDPOINTS } from './endpoints';

export const getStudentProfile = async () => {
  const response = await client.get(ENDPOINTS.AUTH.STUDENT.PROFILE);
  return response.data;
};

export const getLecturerProfile = async () => {
  const response = await client.get(ENDPOINTS.AUTH.LECTURER.PROFILE);
  return response.data;
};


