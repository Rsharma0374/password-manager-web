// encryptionService.js
import CryptoJS from 'crypto-js';
import bcrypt from 'bcryptjs';

// const API_URL = 'https://api.guardianservices.in';
const API_URL = import.meta.env.VITE_API_URL;


export async function hashPassword(password) {
    try {
      const saltRounds = 10; // MUST match Java side
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      console.error("Error hashing password:", error);
      return null; // Or handle the error as needed
    }
  }

class EncryptionService {
    static instance = null;
    #encryptionKey = null;
    #keyPromise = null;

    constructor() {
        // Don't automatically initialize here
    }

    static getInstance() {
        if (!EncryptionService.instance) {
            EncryptionService.instance = new EncryptionService();
        }
        return EncryptionService.instance;
    }

    async #initializeKey() {
        if (!this.#keyPromise) {
            this.#keyPromise = (async () => {
                try {
                    const response = await fetch(`${API_URL}/api/key`);
                    if (!response.ok) {

                        throw new Error('Failed to fetch encryption key');
                    }

                    // Parse the JSON response
                    const jsonResponse = await response.json();

                    // Extract the payload from oBody
                    const encodedKey = jsonResponse.oBody?.payLoad;
                    if (!encodedKey) {
                        throw new Error('Encryption key payload is missing in the response');
                    }

                    // Decode the Base64 string into a byte array
                    const decodedBytes = Uint8Array.from(atob(encodedKey), char => char.charCodeAt(0));

                    // Remove the first 16 bytes (IV)
                    const keyBytes = decodedBytes.slice(16);

                    // Convert the key bytes back to a Base64 string if needed
                    const encryptionKey = btoa(String.fromCharCode(...keyBytes));

                    this.#encryptionKey = encryptionKey;
                    return encryptionKey;
                } catch (error) {
                    console.error('Error fetching encryption key:', error);
                    throw error;
                }
            })();
        }
        return this.#keyPromise;
    }


    async initialize() {
        return this.#initializeKey();
    }

    async encrypt(data) {
        try {
            // Make sure key is loaded
            if (!this.#encryptionKey) {
                await this.#initializeKey();
            }

            const decodedKey = CryptoJS.enc.Base64.parse(this.#encryptionKey);
            return CryptoJS.AES.encrypt(data, decodedKey, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
            }).toString();
        } catch (error) {
            console.error('Encryption failed:', error);
            throw error;
        }
    }

    async post(endpoint, data) {
        try {
            const encryptedData = await this.encrypt(JSON.stringify(data));

            const response = await fetch(`https://api.guardianservices.in/api/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ encryptedPayload: encryptedData }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.text();
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    }
}

export const encryptionService = EncryptionService.getInstance();