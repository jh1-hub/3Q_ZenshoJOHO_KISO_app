import CryptoJS from 'crypto-js';

const SECRET_KEY = 'it-quiz-master-storage-key';

export const storage = {
  setItem: (key: string, value: string) => {
    try {
      const encrypted = CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
      localStorage.setItem(key, encrypted);
    } catch (e) {
      console.error('Storage encryption error:', e);
      localStorage.setItem(key, value); // Fallback to plain text if encryption fails
    }
  },
  getItem: (key: string): string | null => {
    const value = localStorage.getItem(key);
    if (!value) return null;
    
    try {
      const bytes = CryptoJS.AES.decrypt(value, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      if (!decrypted) return value; // Might be old plain text data
      return decrypted;
    } catch (e) {
      // If decryption fails, it's likely plain text from an older version
      return value;
    }
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
  }
};
