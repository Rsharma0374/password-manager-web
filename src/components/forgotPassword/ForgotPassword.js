import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import SignImg from '../SignImg';
import '../popup/Popup.css';
import Popup from '../popup/Popup';
import { NavLink } from 'react-router-dom';

const ForgotPassword = () => {

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [buttonPopup, setButtonPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [showSignImg, setShowSignImg] = useState(true);

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
        }  else if (!data || !data.email) {
            alert("Email is missing in the form");
            return;
        }

        setLoading(true);

        const url = "https://api.r-sharma.in/user/user-login"
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                sUserName: data.username,
                sSHAPassword: data.password,
            }),

        })
            .then(response => response.json())
            .then(data => {
                setPopupMessage(data && data.oBody.payLoad && data.oBody.payLoad.sResponse);
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
        });
        setLoading(false);
        setEmailError('');
    };

    const handlePopupOk = () => {
        setButtonPopup(false);
        // Reload the home page
        window.location.reload();
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
                        <h3 className='text-center col-lg-7 mb-4'>Forgot Password</h3>
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
                                {loading ? (<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>) : ("Submit")}
                            </Button>
                        </Form>
                        <Popup trigger = {buttonPopup}>
                            <h2>{popupMessage}</h2>
                            <button className='ok-button' onClick={handlePopupOk}>OK</button>
                        </Popup>
                    
                        <p className='mt-3'><span> <NavLink to="/login">Sign In</NavLink></span></p>
                    </div>
                    {showSignImg && <SignImg />}
                </section>
            </div>
    </>
  )
}

export default ForgotPassword