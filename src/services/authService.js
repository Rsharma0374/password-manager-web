import { encryptionService } from "./EncryptionService";

const API_URL = 'https://api.guardianservices.in';
// const API_URL = 'http://localhost:10001';
const PRODUCT_NAME = "PASSWORD_MANAGER"

export const login = async (identifier, bCryptPassword) => {

  const mappedDetails = {
    sUserIdentifier: identifier,
    sSHAPassword: bCryptPassword,
    sProductName: PRODUCT_NAME,
  };

  const encryptedData = await encryptionService.encrypt(JSON.stringify(mappedDetails));

  const response = await fetch(`${API_URL}/auth/user-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({encryptedPayload : encryptedData}),
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

export const validateOTP = async (otp, otpId) => {

  const mappedDetails = {
    sOtp: otp,
    sOtpId: otpId,
    sProductName: PRODUCT_NAME,
  };

  const encryptedData = await encryptionService.encrypt(JSON.stringify(mappedDetails));

  const response = await fetch(`${API_URL}/communications/validate-email-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ encryptedPayload: encryptedData }),
  });
  return response.json();
};

export const forgotPasswordService = {
  // Send OTP to email
  sendOTP: async (identifier) => {

    const mappedDetails = {
      sUserIdentifier: identifier,
      sProductName: PRODUCT_NAME,
    };
    const encryptedData = await encryptionService.encrypt(JSON.stringify(mappedDetails));
    const response = await fetch(`${API_URL}/auth/forget-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ encryptedPayload: encryptedData }),
    });

    return response.json();
  },

  // Verify OTP
  validateOtpRestPassword: async (otp, otpId) => {

    const mappedDetails = {
      sOtp: otp,
      sOtpId: otpId,
      sProductName: PRODUCT_NAME,
    };
    const encryptedData = await encryptionService.encrypt(JSON.stringify(mappedDetails));

    const response = await fetch(`${API_URL}/communications/validate-otp-reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ encryptedPayload: encryptedData }),
    });

    return response.json();
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