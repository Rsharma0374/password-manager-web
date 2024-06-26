import React, { useState, useEffect } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import SignImg from '../SignImg';
import Popup from '../popup/Popup';
import '../popup/Popup.css';
import OtpPopup from '../otpPopup/OtpPopup';
import { NavLink } from 'react-router-dom';
import sha1 from 'js-sha1';

const Login = () => {

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [buttonPopup, setButtonPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [showSignImg, setShowSignImg] = useState(true);
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const [otpMessage, setOtpMessage] = useState("");
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);


    const getdata = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        //Validation for Username
        if (name === 'username') {
            const isValidUsername = /^[a-zA-Z0-9]{5,}$/.test(value);
            setUsernameError(isValidUsername ? "" : "Username must be at least 5 characters and contain only letters and numbers");
        }
        // Validate password
        if (name === 'password') {
            // Implement your password validation logic here
            const isValidPassword = /^[a-zA-Z0-9]{8,}$/.test(value) && !/\s/.test(value);
            setPasswordError(isValidPassword ? "" : "Your password must be a minimum of 8 characters and should not contain any spaces.");
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        loginApiCall(data);

    };
    
    const loginApiCall = (data) => {
        if (Object.keys(data).length === 0) {
            alert("Please fill the form");
            return;
        } else if (usernameError !== "") {
            alert(usernameError);
            return;
        } else if (passwordError !== "") {
            alert(passwordError);
            return;
        }  else if (!data || !data.username) {
            alert("Please enter username");
            return;
        } else if (!data || !data.password) {
            alert("Please enter password");
            return;
        } 

        setLoading(true);
        const encryptPassword = sha1(data.password);

        const url = "https://api.r-sharma.in/user/user-login"
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                sUserName: data.username,
                sSHAPassword: encryptPassword,
            }),

        })
            .then(response => response.json())
            .then(data => {
                if (data && data.oBody.payLoad && data.oBody.payLoad.sResponse === "Access Granted") {
                    // Show OTP popup
                    setShowOtpPopup(true);
                    setOtpMessage(data.oBody.payLoad.sOtpToken)
                } else {
                    setPopupMessage(data && data.oBody.payLoad && data.oBody.payLoad.sResponse);
                    setButtonPopup(true);
                    clearForm();
                }

            })
            .catch(error => {
                setPopupMessage("An error occurred while processing your request.", error);
            })
            .finally(() => {
                setLoading(false); // Set loading to false regardless of success or failure
            });
    }

    const clearForm = () => {
        setData({
            username: '',
            password: '',
        });
        setLoading(false);
        setUsernameError('');
        setPasswordError('');
        setShowPassword(false);
    };

    const handlePopupOk = () => {
        setButtonPopup(false);
        // Reload the home page
        window.location.reload();
    };

    const handleOtpSubmit = (otp) => {
        // Handle OTP submission here
        console.log('Submitted OTP:', otp);
        // Call your API function to submit OTP here
        // For now, let's assume you have a function named 'submitOtpApiCall'
        submitOtpApiCall(otp);
        setShowOtpPopup(false); // Close OTP popup after submission
    };

    const submitOtpApiCall = (otp) => {
        // Make API call to submit OTP
        // Example:
        const otpUrl = "https://api.r-sharma.in/user/validate-verification-otp";
        fetch(otpUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                sOtp: otp,
                sOtpId: otpMessage,
                sProductName: "Password-Manager"
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.oBody.payLoad && data.oBody.payLoad.bSuccess === true) {
                setPopupMessage("Otp validated success");
                setButtonPopup(true);
                setShowSuccessPopup(true)
                clearForm();

            } else if (data && data.oBody.payLoad && data.oBody.payLoad.bSuccess === false && data.oBody.payLoad.sMessage === "Otp Expired.") {
                setPopupMessage(data.oBody.payLoad.sMessage);
                setButtonPopup(true);
                setShowSuccessPopup(true)
                clearForm();

            } else {
                setPopupMessage("Invalid OTP");
            }
        })
        .catch(error => {
            // Handle error if OTP submission fails
            // You can show an error message or retry OTP submission
        });
    }

    // Update showSignImg state based on screen width
    useEffect(() => {
        const handleResize = () => {
            setShowSignImg(window.innerWidth >= 800);
        };

        handleResize(); // Initial check

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

  return (
    <>
    <div className="container mt-3">
                <section className='d-flex justify-content-between'>
                    <div className="left_data mt-3 p-3" style={{ width: "100%" }}>
                        <h3 className='header-logo text-center col-lg-7 mb-4'>Sign In</h3>
                        <Form onSubmit={(e) => handleSubmit(e)}>
                          
                            <Form.Group className="mb-3 col-lg-7" controlId="formBasicUsername">
                                <Form.Control type="text" name='username' onChange={getdata} placeholder="Username" isInvalid={!!usernameError} />
                                <Form.Control.Feedback type="invalid">
                                    {usernameError}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3 col-lg-7" controlId="formBasicPassword">
                                <InputGroup>
                                    <Form.Control type={showPassword ? 'text' : 'password'} name='password' onChange={getdata} placeholder="Password" isInvalid={!!passwordError} />
                                    <InputGroup.Text onClick={toggleShowPassword} style={{ cursor: 'pointer' }}>
                                        {showPassword ? <EyeSlash /> : <Eye />}
                                    </InputGroup.Text>
                                    <Form.Control.Feedback type="invalid">
                                        {passwordError}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                            
                            <Button variant="primary" className='col-lg-7' style={{ background: "rgb(67, 185, 127)" }} type="submit" disabled={loading} >
                                {loading ? (<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>) : ("Submit")}
                            </Button>
                        </Form>
                        <Popup trigger = {buttonPopup}>
                            <h2>{popupMessage}</h2>
                            <button className='ok-button' onClick={handlePopupOk}>OK</button>
                        </Popup>
                    
                        <p className='mt-3'><span> <NavLink to="/forgot-password">Forgot Password?</NavLink></span></p>
                        <p className='mt-3'>Create an account <span> <NavLink to="/">Sign Up</NavLink></span></p>
                    </div>
                    {showSignImg && <SignImg />}
                </section>
            </div>
            {showOtpPopup && <OtpPopup onSubmit={handleOtpSubmit} />}
    </>
  )
}

export default Login