import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { hashPassword } from '../services/EncryptionService'
import { login } from '../services/authService';



const Login = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [otpId, setOtpId] = useState('');
    const [step, setStep] = useState(1);
    const [errorMessage, setErrorMessage] = useState(''); // For showing error messages
    const [successMessage, setSuccessMessage] = useState(''); // For showing success messages
    const [loading, setLoading] = useState(false);



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const bCryptPassword = await hashPassword(password)

            if (step === 1) {
                const res = await login(identifier, bCryptPassword);
                if (res && res.oBody && res.oBody.payLoad && res.oBody.payLoad.sStatus === "SUCCESS") {
                    const otpId = res.oBody.payLoad.sOtp;
                    setSuccessMessage(res.oBody.payLoad.sResponse)
                    setTimeout(() => setSuccessMessage(''), 5000);
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
            } else {
                // In a real app, verify OTP here
                console.log('Login successful');
            }

        } catch (error) {
            console.error('Error occurred while sending otp:', error);
            setErrorMessage("Failed to send OTP. Please check your network connection and try again.");
            setTimeout(() => setErrorMessage(''), 5000);
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {step === 1 ? 'Welcome back' : 'Enter OTP'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {step === 1
                            ? 'Please sign in to continue'
                            : 'We sent a code to your email'}
                    </p>
                </div>
                {/* Error Message */}
                {errorMessage && (
                    <div className="mb-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
                        {errorMessage}
                    </div>
                )}
                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 text-sm text-green-700 bg-green-100 rounder-lg">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {step === 1 ? (
                        <>
                            <div className="space-y-4">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Email or Username"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <label htmlFor="remember" className="ml-2 text-sm text-gray-500">
                                        Remember me
                                    </label>
                                </div>
                                <button
                                    onClick={() => navigate('/forgot-password')}
                                    type="button"
                                    className="text-sm text-blue-600 hover:text-blue-500"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-4 py-2 text-center text-lg tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                maxLength={6}
                                required
                            />
                            <p className="text-center text-sm text-gray-500">
                                Didn't receive code?{' '}
                                <button
                                    type="button"
                                    className="text-blue-600 hover:text-blue-500"
                                >
                                    Resend
                                </button>
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        {loading ? (
                            step === 1 ? "Sending OTP..." : "Verifying..." // Display "Verifying..." in step 2
                        ) : step === 1 ? (
                            "Continue"
                        ) : (
                            "Verify and Login"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-500">Don't have an account?</span>{' '}
                    <button onClick={() => navigate('/signup')} className="text-blue-600 hover:text-blue-500">
                        Sign up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;