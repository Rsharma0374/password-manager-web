import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup, sendEmailVerificationOTP, validateOTP } from '../services/authService'
import CryptoJS from 'crypto-js';
import { Eye, EyeOff, Mail, Lock, User, Calendar, UsersRound } from 'lucide-react';

function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 for SignUp, 2 for OTP
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // For showing error messages
  const [successMessage, setSuccessMessage] = useState(''); // For showing success messages
  const [otpId, setOtpId] = useState('');
  const [inputType, setInputType] = useState("text");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true); // Tracks if passwords match
  const [isPasswordValid, setIsPasswordValid] = useState(true); // Tracks if password meets criteria
  const [isUsernameValid, setIsUsernameValid] = useState(true); // Tracks if username meets criteria



  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dateOfBirth: '',
  });

  // Use useEffect to check if passwords match whenever the fields change
  useEffect(() => {
    if (formData.password === formData.confirmPassword || formData.confirmPassword === '') {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }
  }, [formData.password, formData.confirmPassword]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      setIsPasswordValid(value.length >= 8); // Check if password is at least 8 characters
    }
    if (name === 'username') {
      setIsUsernameValid(value.length >= 8)
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);

    // Set the input type to "text" when typing starts
    setInputType("text");

    // Convert to "password" after 2 seconds
    setTimeout(() => {
      setInputType("password");
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(''); // Clear any previous error messages
    try {
      // Add your signup logic here
      const res = await sendEmailVerificationOTP(formData.email);
      if (res && res.oBody && res.oBody.payLoad && res.oBody.payLoad.bSuccess === true) {
        const otpId = res.oBody.payLoad.sOtp;
        setOtpId(otpId);
        setStep(2); //for otp
      } else if (res && res.aError && res.aError.length > 0) {
        const error = res.aError[0];
        if (error) {
          setErrorMessage(error.sMessage);
          setTimeout(() => setErrorMessage(''), 5000);
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
          setTimeout(() => setErrorMessage(''), 5000);
        }
      } else {
        setErrorMessage("An unexpected error occurred. Please contact system administrator.");
        setTimeout(() => setErrorMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error occurred while sending otp:', error);
      setErrorMessage("Failed to send OTP. Please check your network connection and try again.");
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setLoading(false);
    }
    // setStep(2); //for otp
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const encryptedValue = CryptoJS.SHA1(otp + otpId).toString(CryptoJS.enc.Hex);
      // Add your signup logic here
      const res = await validateOTP(otp, otpId);
      if (res && res.oBody && res.oBody.payLoad && res.oBody.payLoad.sStatus === "SUCCESS" && res.oBody.payLoad.sEncryptedValue === encryptedValue) {
        setSuccessMessage(res.oBody.payLoad.sResponse);
        setTimeout(() => setSuccessMessage(''), 2000);
        // Call the signup API
        callSignupApi(formData);
      } else if (res && res.aError && res.aError.length > 0) {
        const error = res.aError[0];
        if (error) {
          setErrorMessage(error.sMessage);
          setTimeout(() => setErrorMessage(''), 5000);
          setLoading(false);
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
          setTimeout(() => setErrorMessage(''), 5000);
          setLoading(false);
        }
      } else {
        setErrorMessage("An unexpected error occurred. Please contact system administrator.");
        setTimeout(() => setErrorMessage(''), 5000);
        setLoading(false);
      }

      // navigate('/'); // Navigate to login after successful verification
    } catch (error) {
      console.error('Error verifying OTP:', error);
    } finally {
      // setLoading(false);
    }
  };

  const callSignupApi = async (e) => {
    setLoading(true);
    setErrorMessage(''); // Clear any previous error messages
    setSuccessMessage('')

    try {
      const res = await signup(formData);
      if (res && res.oBody && res.oBody.payLoad && res.oBody.payLoad.sStatus === "SUCCESS") {

        setSuccessMessage(res.oBody.payLoad.sResponseMessage);

        // Keep loading true until navigation
        setTimeout(() => {
          setLoading(false);
          navigate('/');
        }, 5000);
      } else if (res && res.aError && res.aError.length > 0) {
        const error = res.aError[0];
        if (error) {
          setErrorMessage(error.sMessage);
          setTimeout(() => setErrorMessage(''), 5000);
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
          setTimeout(() => setErrorMessage(''), 5000);
        }
        setLoading(false)
      } else {
        setErrorMessage("An unexpected error occurred. Please contact system administrator.");
        setTimeout(() => setErrorMessage(''), 5000);
        setLoading(false)
      }

    } catch (error) {
      console.error('Error while signup api calling:', error);
      setErrorMessage("An error occurred during signup. Please try again.");
      setTimeout(() => setErrorMessage(''), 5000);
      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 1 ? 'Create Account' : 'Enter OTP'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {step === 1
              ? 'Please fill in your details'
              : 'Enter the OTP sent to your email'}
          </p>
        </div>
        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 text-sm text-green-700 bg-green-100 rounder-lg">
            {successMessage}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                required
              />
            </div>

            {/* Username Field */}
            <div className="relative">
              <UsersRound className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                required
              />
            </div>
            {!isUsernameValid && (
              <div className="text-sm text-red-600 mt-2">
                Username must be at least 8 characters long.
              </div>
            )}

            {/* Email Field */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {/* Show error message if passwords don't match or password is not 8 character */}
            {!isPasswordValid && (
              <div className="text-sm text-red-600 mt-2">
                Password must be at least 8 characters long.
              </div>
            )}
            {!passwordsMatch && (
              <div className="text-sm text-red-600 mt-2">
                Password and Confirm Password do not match.
              </div>
            )}

            {/* Confirm Password Field */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Gender Selection */}
            <div className="relative">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none bg-white"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]} // Restrict to past dates
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!passwordsMatch || loading} // Disable button if passwords don't match or loading is true
              // className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${(!passwordsMatch || !isUsernameValid || loading) && 'opacity-50 cursor-not-allowed'
                }`}
            >
              {loading ? 'Loading...' : 'Create Account'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOTPSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={inputType}
                placeholder="Enter OTP"
                value={otp}
                onChange={handleOtpChange}
                maxLength={6}
                handleOtpChange
                className="w-full px-4 py-2 text-center text-lg tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Didn't receive OTP? Try again
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-500">Already have an account?</span>{' '}
          <button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-500">
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
