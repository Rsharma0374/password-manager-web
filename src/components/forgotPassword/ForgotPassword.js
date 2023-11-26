import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import SignImg from '../SignImg';
import '../popup/Popup.css';
import Popup from '../popup/Popup';
import { NavLink, useNavigate } from 'react-router-dom';
import '../../index.css';
import './ForgotPassword.css';

const ForgotPassword = () => {

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [buttonPopup, setButtonPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [showSignImg, setShowSignImg] = useState(true);
    const [otpMessage, setOtpMessage] = useState("");
    const navigate = useNavigate();
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);


    const getdata = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Validation for Email
        if (name === 'email') {
            const isValidEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
            setEmailError(isValidEmail ? "" : "Enter a valid email address");
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        forgotPasswordApiCall(data);

    };

    const forgotPasswordApiCall = (data) => {
        if (Object.keys(data).length === 0) {
            alert("Please fill the form");
            return;
        } else if (emailError !== "") {
            alert(emailError);
            return;
        } else if (!data || !data.email) {
            alert("Email is missing in the form");
            return;
        }

        setLoading(true);

        const url = "https://api.r-sharma.in/user/forget-password"
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                sEmailId: data.email,
                sEmailType: "EMAIL_OTP_SMS",
                bIsOtpRequired: true,
                sProductName: "Password-Manager"
            }),

        })
            .then(response => response.json())
            .then(data => {
                if (data && data.oBody.payLoad && data.oBody.payLoad.bSuccess === true) {
                    setOtpMessage(data.oBody.payLoad.sOtp)
                    setPopupMessage("Otp Send Successfully");
                } else {
                    setPopupMessage("Email Incorrect.")
                }
                console.log(data.oBody.payLoad.sResponse)
                setButtonPopup(true);
                clearForm();

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
            email: '',
            otp: '',
        });
        setLoading(false);
        setEmailError('');
    };

    const validateOtp = (data) => {
        setLoading(true);

        const url = "https://api.r-sharma.in/user/validate-email-otp";
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                sOtp: data.otp,
                sOtpId: otpMessage,
                sProductName: "Password-Manager"
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data && data.oBody.payLoad && data.oBody.payLoad.bSuccess === true) {
                    setPopupMessage("New Password has been shared to registered Email Id");
                    setButtonPopup(true);
                    setShowSuccessPopup(true)
                    clearForm();

                    // Redirect to the login page after 6 seconds
                    setTimeout(() => {
                        navigate('/login');
                    }, 6000);
                } else if (data && data.oBody.payLoad && data.oBody.payLoad.bSuccess === false && data.oBody.payLoad.sMessage === "Otp Expired.") {
                    setPopupMessage(data.oBody.payLoad.sMessage);
                    setButtonPopup(true);
                    setShowSuccessPopup(true)
                    clearForm();

                    // Redirect to the login page after 6 seconds
                    setTimeout(() => {
                        navigate('/login');
                    }, 6000);

                } else {
                    setPopupMessage("Invalid OTP");
                }
                setButtonPopup(true);
                clearForm();
            })
            .catch(error => {
                setPopupMessage("An error occurred while processing your request.", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };


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
                        <h3 className='header-logo text-center col-lg-7 mb-4'>Forgot Password</h3>
                        <Form onSubmit={(e) => handleSubmit(e)}>

                            <Form.Group className="mb-3 col-lg-7" controlId="formBasicEmail">
                                <Form.Control type="email" name='email' onChange={getdata} placeholder="Enter email" isInvalid={!!emailError} />
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                                </Form.Text>
                                <Form.Control.Feedback type="invalid">
                                    {emailError}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Button variant="primary" className='col-lg-7' style={{ background: "rgb(67, 185, 127)" }} type="submit" disabled={loading} >
                                {loading ? (<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>) : ("Send Otp")}
                            </Button>
                        </Form>
                        <Popup trigger={buttonPopup}>

                            {showSuccessPopup ? (
                                <div className="success-popup">
                                    {popupMessage}
                                </div>
                            ) : (
                                <>
                                    <h2>{popupMessage}</h2>
                                    <input className='input-otp' name='otp' type="number" onChange={getdata} placeholder='Enter Otp' />
                                    <Button variant="primary" className='col-lg-3 m-1' style={{ background: "rgb(67, 185, 127)" }} onClick={() => validateOtp(data)} type="submit" disabled={loading}>
                                    {loading ? (<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>) : ("Verify Otp")}
                                    </Button>
                                </>
                            )}
                        </Popup>
                        <p className='mt-3'>Already Have an Account? <span> <NavLink to="/login">Sign In</NavLink></span></p>
                    </div>
                    {showSignImg && <SignImg />}
                </section>
            </div>
        </>
    )
}

export default ForgotPassword