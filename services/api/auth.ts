import client from './client';
import { ENDPOINTS } from './endpoints';

// Student
export const studentLogin = async (email: string, password: string) => {
  const response = await client.post(ENDPOINTS.AUTH.STUDENT.LOGIN, { email, password });
  return response.data;
};

export const studentRegister = async (data: { email: string; password: string }) => {
    const response = await client.post(ENDPOINTS.AUTH.STUDENT.REGISTER, data);
    return response.data;
};

export const studentLogout = async () => {
    const response = await client.post(ENDPOINTS.AUTH.STUDENT.LOGOUT);
    return response.data;
};

// Lecturer
export const lecturerLogin = async (email: string, password: string) => {
  const response = await client.post(ENDPOINTS.AUTH.LECTURER.LOGIN, { email, password });
  return response.data;
};

export const lecturerRegister = async (data: { email: string; password: string }) => {
  const response = await client.post(ENDPOINTS.AUTH.LECTURER.REGISTER, data);
  return response.data;
};

export const lecturerLogout = async () => {
  const response = await client.post(ENDPOINTS.AUTH.LECTURER.LOGOUT);
  return response.data;
};
