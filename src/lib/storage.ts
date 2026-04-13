import LZString from 'lz-string';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'it-quiz-master-storage-key';

export const storage = {
  setItem: (key: string, value: string) => {
    try {
      // Use LZString for obfuscation and compression with a prefix
      const compressed = LZString.compressToEncodedURIComponent(value);
      localStorage.setItem(key, 'LZ_' + compressed);
    } catch (e) {
      console.error('Storage compression error:', e);
      localStorage.setItem(key, value); // Fallback to plain text if compression fails
    }
  },
  getItem: (key: string): string | null => {
    const value = localStorage.getItem(key);
    if (!value) return null;
    
    // 1. Check for our new prefix
    if (value.startsWith('LZ_')) {
      return LZString.decompressFromEncodedURIComponent(value.substring(3)) || value;
    }

    // 2. Check for AES encryption (CryptoJS default starts with Salted__)
    if (value.startsWith('U2FsdGVkX1')) {
      try {
        const bytes = CryptoJS.AES.decrypt(value, SECRET_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        if (decrypted) return decrypted;
      } catch (e) {
        // ignore
      }
    }

    // 3. Check for plain text JSON
    if (value.startsWith('{') || value.startsWith('[') || value.startsWith('"')) {
      return value;
    }

    // 4. Handle legacy data from the previous edit (LZString without prefix)
    if (/^[A-Za-z0-9+\-$]+$/.test(value)) {
      try {
        const decompressed = LZString.decompressFromEncodedURIComponent(value);
        if (decompressed) {
          // If it decompresses to valid JSON, it was definitely LZString
          if (decompressed.startsWith('{') || decompressed.startsWith('[') || decompressed.startsWith('"')) {
            try {
              JSON.parse(decompressed);
              return decompressed;
            } catch (e) {
              // ignore
            }
          }
          // If it's a simple boolean or number
          if (decompressed === 'true' || decompressed === 'false' || !isNaN(Number(decompressed))) {
            return decompressed;
          }
        }
      } catch (e) {
        // ignore
      }
    }

    // Fallback: return original value (could be plain text username, etc.)
    return value;
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
  }
};
