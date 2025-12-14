import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Deprecated/Unused session functions stubs to prevent import errors if any leftover references exist
export const createSession = () => { throw new Error("Use NextAuth"); };
export const getUserFromSession = () => { throw new Error("Use NextAuth"); };
export const destroySessionCookie = () => { throw new Error("Use NextAuth"); };
