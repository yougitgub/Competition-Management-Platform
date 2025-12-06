import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { createSession as dbCreateSession, getSession as dbGetSession, deleteSession as dbDeleteSession, getUserByEmail, getUserById } from './db.js';

export const hashPassword = async (password) => {
  return password; // Store plain text
};

export const verifyPassword = async (password, hash) => {
  return password === hash; // Compare plain text
};

export const createSession = (res, user_id) => {
  const token = uuidv4();
  const expires = dayjs().add(7, 'day').toISOString();
  dbCreateSession(token, user_id, expires);
  // Set cookie header using Set-Cookie in route handler; here we return the cookie string
  const cookie = `session=${token}; Path=/; HttpOnly; SameSite=Strict; Expires=${new Date(expires).toUTCString()}`;
  return { token, cookie };
};

export const getUserFromSession = (token) => {
  if (!token) return null;
  const session = dbGetSession(token);
  if (!session) return null;
  if (dayjs().isAfter(dayjs(session.expires_at))) {
    dbDeleteSession(token);
    return null;
  }
  const user = getUserById(session.user_id);
  return user || null;
};

export const destroySessionCookie = (token) => {
  dbDeleteSession(token);
  const cookie = `session=; Path=/; HttpOnly; SameSite=Strict; Expires=${new Date(0).toUTCString()}`;
  return cookie;
};
