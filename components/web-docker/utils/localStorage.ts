import { uuidv4 } from './uuidv4';

export const APP_PREFIX = 'socialize_';
/**
 * List all of the keys available for localStorage
 */
export const KEYS_CONFIG = {
  SESSION_ID: `${APP_PREFIX}sessionID`,
};

export const createSessionID = (): string => {
  if (typeof localStorage === 'undefined') return '';
  const id = uuidv4();
  localStorage.setItem(KEYS_CONFIG.SESSION_ID, id);
  return id;
};

/**
 * Create a unique Session ID that is unique for each browser instance
 */
export const findOrCreateSessionID = (): string => {
  if (typeof localStorage === 'undefined') return '';
  const sessionID = localStorage.getItem(KEYS_CONFIG.SESSION_ID);
  if (sessionID) return sessionID;

  return createSessionID();
};
