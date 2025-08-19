// import { encryptionService } from "./EncryptionService";
import { encryptAES, decryptAES } from "./CryptoUtils"
const API_URL = import.meta.env.VITE_API_URL;
const API_URL_USER_SERVICE = import.meta.env.VITE_API_URL_USER_SERVICE;
const PRODUCT_NAME = "PASSWORD_MANAGER"

export const login = async (identifier, bCryptPassword) => {

  const mappedDetails = {
    sUserIdentifier: identifier,
    sSHAPassword: bCryptPassword,
    sProductName: PRODUCT_NAME,
  };

  // const encryptedData = await encryptionService.encrypt(JSON.stringify(mappedDetails));
  const encryptedData = encryptAES(JSON.stringify(mappedDetails));

  const response = await fetch(`${API_URL_USER_SERVICE}/auth/user-login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'sKeyId': sessionStorage.getItem('KEY_ID')
    },
    body: JSON.stringify({ encryptedPayload: encryptedData }),
  });

  const resposeJson = await response.json()
  // Wait for the text response
  const encryptedResponse = resposeJson.sResponse;

  // Decrypt the response
  const decryptedResponse = decryptAES(encryptedResponse);
  // Parse into BaseResponse format
  const parsedResponse = JSON.parse(decryptedResponse);
  return parsedResponse;
};

export const callLogout = async (userName) => {

  const token = sessionStorage.getItem('token');
  const username = sessionStorage.getItem('username');
  const mappedDetails = {
    sUserName: userName,
    sProductName: PRODUCT_NAME,
  };

  // const encryptedData = await encryptionService.encrypt(JSON.stringify(mappedDetails));
  const encryptedData = encryptAES(JSON.stringify(mappedDetails));

  const response = await fetch(`${API_URL_USER_SERVICE}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'userName': username,
      'sKeyId': sessionStorage.getItem('KEY_ID')
    },
    body: JSON.stringify({ encryptedPayload: encryptedData }),
  });

  const resposeJson = await response.json()
  // Wait for the text response
  const encryptedResponse = resposeJson.sResponse;

  // Decrypt the response
  const decryptedResponse = decryptAES(encryptedResponse);
  // Parse into BaseResponse format
  const parsedResponse = JSON.parse(decryptedResponse);
  return parsedResponse;
};

export const dashboardApi = async (username, identifier, token) => {

  const mappedDetails = {
    sIdentifier: identifier,
    sProductName: PRODUCT_NAME,
  };
  const encryptedData = encryptAES(JSON.stringify(mappedDetails));
  const response = await fetch(`${API_URL}/password-manager/get-dashboard-details`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'userName': username,
      'sKeyId': sessionStorage.getItem('KEY_ID')
    },
    body: JSON.stringify({ encryptedPayload: encryptedData }),
  });
  const resposeJson = await response.json()
  // Wait for the text response
  const encryptedResponse = resposeJson.sResponse;

  // Decrypt the response
  const decryptedResponse = decryptAES(encryptedResponse);
  // Parse into BaseResponse format
  const parsedResponse = JSON.parse(decryptedResponse);
  return parsedResponse;
};

//save new entry in creds
export const addEntry = async (data) => {

  const token = sessionStorage.getItem('token');
  const username = sessionStorage.getItem('username');

  const mappedDetails = {
    sUserName: data.sUserName,
    sEmail: data.sEmail,
    sPassword: data.sPassword,
    sService: data.sService,
    sUrl: data.sUrl
  };
  const encryptedData = encryptAES(JSON.stringify(mappedDetails));
  const response = await fetch(`${API_URL}/password-manager/save-data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'userName': username,
      'sKeyId': sessionStorage.getItem('KEY_ID')
    },
    body: JSON.stringify({ encryptedPayload: encryptedData }),
  });
  const resposeJson = await response.json()
  // Wait for the text response
  const encryptedResponse = resposeJson.sResponse;

  // Decrypt the response
  const decryptedResponse = decryptAES(encryptedResponse);
  // Parse into BaseResponse format
  const parsedResponse = JSON.parse(decryptedResponse);
  return parsedResponse;
};

//update the entry in creds
export const updateEntry = async (data) => {

  const token = sessionStorage.getItem('token');
  const username = sessionStorage.getItem('username');

  const mappedDetails = {
    sUserName: data.sUserName,
    sEmail: data.sEmail,
    sPassword: data.sPassword,
    sService: data.sService,
    sUrl: data.sUrl
  };
  const encryptedData = encryptAES(JSON.stringify(mappedDetails));
  const response = await fetch(`${API_URL}/password-manager/update-data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'userName': username,
      'sKeyId': sessionStorage.getItem('KEY_ID')
    },
    body: JSON.stringify({ encryptedPayload: encryptedData }),
  });
  const resposeJson = await response.json()
  // Wait for the text response
  const encryptedResponse = resposeJson.sResponse;

  // Decrypt the response
  const decryptedResponse = decryptAES(encryptedResponse);
  // Parse into BaseResponse format
  const parsedResponse = JSON.parse(decryptedResponse);
  return parsedResponse;
};

//delete the entry in creds
export const deleteEntry = async (data) => {

  const token = sessionStorage.getItem('token');
  const username = sessionStorage.getItem('username');

  const mappedDetails = {
    sUserName: data.sUserName,
    sEmail: data.sEmail,
    sPassword: data.sPassword,
    sService: data.sService,
    sUrl: data.sUrl
  };
  const encryptedData = encryptAES(JSON.stringify(mappedDetails));
  const response = await fetch(`${API_URL}/password-manager/delete-data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'userName': username,
      'sKeyId': sessionStorage.getItem('KEY_ID')
    },
    body: JSON.stringify({ encryptedPayload: encryptedData }),
  });
  const resposeJson = await response.json()
  // Wait for the text response
  const encryptedResponse = resposeJson.sResponse;

  // Decrypt the response
  const decryptedResponse = decryptAES(encryptedResponse);
  // Parse into BaseResponse format
  const parsedResponse = JSON.parse(decryptedResponse);
  return parsedResponse;
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
  // const encryptedData = await encryptionService.encrypt(JSON.stringify(mappedDetails));
  const encryptedData = encryptAES(JSON.stringify(mappedDetails));

  const response = await fetch(`${API_URL_USER_SERVICE}/auth/create-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'sKeyId': sessionStorage.getItem('KEY_ID')
    },
    body: JSON.stringify({encryptedPayload: encryptedData}),
  });

  const resposeJson = await response.json()
  // Wait for the text response
  const encryptedResponse = resposeJson.sResponse;

  // Decrypt the response
  const decryptedResponse = decryptAES(encryptedResponse);
  // Parse into BaseResponse format
  const parsedResponse = JSON.parse(decryptedResponse);
  return parsedResponse;
};

export const sendEmailVerificationOTP = async (email, emailType) => {

  const mappedDetails = {
    sEmailId: email,
    sEmailType: emailType,
    bOtpRequired: true,
    sProductName: PRODUCT_NAME,
  };
  // const encryptedData = await encryptionService.encrypt(JSON.stringify(mappedDetails));
  const encryptedData = encryptAES(JSON.stringify(mappedDetails));

  const response = await fetch(`${API_URL_USER_SERVICE}/communications/send-email-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'sKeyId': sessionStorage.getItem('KEY_ID')
    },
    body: JSON.stringify({encryptedPayload: encryptedData}),
  });

  const resposeJson = await response.json()
  // Wait for the text response
  const encryptedResponse = resposeJson.sResponse;

  // Decrypt the response
  const decryptedResponse = decryptAES(encryptedResponse);
  // Parse into BaseResponse format
  const parsedResponse = JSON.parse(decryptedResponse);
  return parsedResponse;
};

export const validateOTP = async (otp, otpId) => {

  const mappedDetails = {
    sOtp: otp,
    sOtpId: otpId,
    sProductName: PRODUCT_NAME,
  };

  // const encryptedData = await encryptionService.encrypt(JSON.stringify(mappedDetails));
  const encryptedData = encryptAES(JSON.stringify(mappedDetails));

  const response = await fetch(`${API_URL_USER_SERVICE}/communications/validate-email-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'sKeyId': sessionStorage.getItem('KEY_ID')
    },
    body: JSON.stringify({ encryptedPayload: encryptedData }),
  });

  const resposeJson = await response.json()
  // Wait for the text response
  const encryptedResponse = resposeJson.sResponse;

  // Decrypt the response
  const decryptedResponse = decryptAES(encryptedResponse);
  // Parse into BaseResponse format
  const parsedResponse = JSON.parse(decryptedResponse);
  return parsedResponse;
};

export const changePassword = async (userIdentifier, oldPassword, newPassword) => {

  const token = sessionStorage.getItem('token');
  const username = sessionStorage.getItem('username');

  const mappedDetails = {
    sUserIdentifier: userIdentifier,
    sOldPassword: oldPassword,
    sNewPassword: newPassword,
    sProductName: PRODUCT_NAME,
  };

  // const encryptedData = await encryptionService.encrypt(JSON.stringify(mappedDetails));
  const encryptedData = encryptAES(JSON.stringify(mappedDetails));

  const response = await fetch(`${API_URL_USER_SERVICE}/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'userName': username,
      'sKeyId': sessionStorage.getItem('KEY_ID')
    },
    body: JSON.stringify({ encryptedPayload: encryptedData }),
  });

  const resposeJson = await response.json()
  // Wait for the text response
  const encryptedResponse = resposeJson.sResponse;

  // Decrypt the response
  const decryptedResponse = decryptAES(encryptedResponse);
  // Parse into BaseResponse format
  const parsedResponse = JSON.parse(decryptedResponse);
  return parsedResponse;
};

export const validate2FAOTP = async (otp, otpId, username) => {

  const mappedDetails = {
    sOtp: otp,
    sOtpId: otpId,
    sUserName: username,
    sProductName: PRODUCT_NAME,
  };

  // const encryptedData = await encryptionService.encrypt(JSON.stringify(mappedDetails));
  const encryptedData = encryptAES(JSON.stringify(mappedDetails));

  const response = await fetch(`${API_URL_USER_SERVICE}/auth/validate-tfa-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'sKeyId': sessionStorage.getItem('KEY_ID')
    },
    body: JSON.stringify({ encryptedPayload: encryptedData }),
  });

  const resposeJson = await response.json()
  // Wait for the text response
  const encryptedResponse = resposeJson.sResponse;

  // Decrypt the response
  const decryptedResponse = decryptAES(encryptedResponse);
  // Parse into BaseResponse format
  const parsedResponse = JSON.parse(decryptedResponse);
  return parsedResponse;
};

export const forgotPasswordService = {
  // Send OTP to email
  sendOTP: async (identifier) => {

    const mappedDetails = {
      sUserIdentifier: identifier,
      sProductName: PRODUCT_NAME,
    };
    // const encryptedData = await encryptionService.encrypt(JSON.stringify(mappedDetails));
    const encryptedData = encryptAES(JSON.stringify(mappedDetails));
    const response = await fetch(`${API_URL_USER_SERVICE}/auth/forget-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'sKeyId': sessionStorage.getItem('KEY_ID')
      },
      body: JSON.stringify({ encryptedPayload: encryptedData }),
    });


    const resposeJson = await response.json()
    // Wait for the text response
    const encryptedResponse = resposeJson.sResponse;

    // Decrypt the response
    const decryptedResponse = decryptAES(encryptedResponse);
    // Parse into BaseResponse format
    const parsedResponse = JSON.parse(decryptedResponse);
    return parsedResponse;
  },

  // Verify OTP
  validateOtpRestPassword: async (otp, otpId) => {

    const mappedDetails = {
      sOtp: otp,
      sOtpId: otpId,
      sProductName: PRODUCT_NAME,
    };
    // const encryptedData = await encryptionService.encrypt(JSON.stringify(mappedDetails));
    const encryptedData = encryptAES(JSON.stringify(mappedDetails));

    const response = await fetch(`${API_URL_USER_SERVICE}/communications/validate-otp-reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'sKeyId': sessionStorage.getItem('KEY_ID')
      },
      body: JSON.stringify({ encryptedPayload: encryptedData }),
    });


    const resposeJson = await response.json()
    // Wait for the text response
    const encryptedResponse = resposeJson.sResponse;

    // Decrypt the response
    const decryptedResponse = decryptAES(encryptedResponse);
    // Parse into BaseResponse format
    const parsedResponse = JSON.parse(decryptedResponse);
    return parsedResponse;
  },

  // Reset password
  resetPassword: async (email, otp, newPassword) => {
    try {
      const response = await fetch(`${API_URL_USER_SERVICE}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'sKeyId': sessionStorage.getItem('KEY_ID')
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      const resposeJson = await response.json()
      // Wait for the text response
      const encryptedResponse = resposeJson.sResponse;

      // Decrypt the response
      const decryptedResponse = decryptAES(encryptedResponse);
      // Parse into BaseResponse format
      const parsedResponse = JSON.parse(decryptedResponse);
      return parsedResponse;
    } catch (error) {
      throw error;
    }
  },
};
