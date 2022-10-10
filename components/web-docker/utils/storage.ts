/* eslint-disable consistent-return */
const storagePrefix = 'app_';

const storage = {
  getToken: () => {
    if (typeof window !== 'undefined') { return JSON.parse(window.localStorage.getItem(`${storagePrefix}token`) as string); }
  },
  setToken: (token: string) => {
    if (typeof window !== 'undefined') { window.localStorage.setItem(`${storagePrefix}token`, JSON.stringify(token)); }
  },
  clearToken: () => {
    if (typeof window !== 'undefined') { window.localStorage.removeItem(`${storagePrefix}token`); }
  },
};

export default storage;
