import { encryptionService } from "./EncryptionService";

const API_URL = 'http://localhost:10001';
const PRODUCT_NAME = "PASSWORD_MANAGER"

export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return response.json();
};

export const signup = async (details) => {

  const mappedDetails = {
    sUserName: details.username,
    sEmail: details.email,
    sPassword: details.password,
    sFullName: details.name,
    sGender: details.gender,
    sDateOfBirth: details.dateOfBirth,
    sProductName: PRODUCT_NAME,
  };

  const response = await fetch(`${API_URL}/auth/create-user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mappedDetails),
  });
  return response.json();
};

export const sendEmailVerificationOTP = async (email) => {

  const mappedDetails = {
    sEmailId: email,
    sEmailType: "EMAIL_OTP_SMS",
    bOtpRequired: true,
    sProductName: PRODUCT_NAME,
  };

  const response = await fetch(`${API_URL}/communications/send-email-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mappedDetails),
  });
  return response.json();
};

export const forgotPasswordService = {
  // Send OTP to email
  sendOTP: async (email) => {
    try {
      const encryptedData = await encryptionService.encrypt(JSON.stringify(email));
      const response = await fetch(`${API_URL}/api/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ encryptedPayload: encryptedData }),
      });

      // if (!response.ok) {
      //   throw new Error('Failed to send OTP');
      // }

      return await response;
    } catch (error) {
      throw error;
    }
  },

  // Verify OTP
  verifyOTP: async (email, otp) => {
    try {
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        throw new Error('Invalid OTP');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  resetPassword: async (email, otp, newPassword) => {
    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};