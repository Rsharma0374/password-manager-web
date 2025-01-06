// encryptionService.js
import CryptoJS from 'crypto-js';

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
                    const response = await fetch('http://localhost:10001/api/key');
                    if (!response.ok) {
                        throw new Error('Failed to fetch encryption key');
                    }
                    const key = await response.text();
                    this.#encryptionKey = key;
                    return key;
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
            
            const response = await fetch(`http://localhost:10001/api/${endpoint}`, {
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