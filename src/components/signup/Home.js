import React, { useState, useEffect } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import SignImg from '../SignImg';
import Popup from '../popup/Popup';
import '../popup/Popup.css';
import { NavLink } from 'react-router-dom';

const Home = () => {
    const [gender, setGender] = useState('');
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [phoneNumberError, setPhoneNumberError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [buttonPopup, setButtonPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [showSignImg, setShowSignImg] = useState(true);



    const handleGenderChange = (event) => {
        const { name, value } = event.target;
        setGender(event.target.value);
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const getdata = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        // Validate phone number
        if (name === 'number') {
            const isValidPhoneNumber = /^\d{10}$/.test(value);
            setPhoneNumberError(isValidPhoneNumber ? "" : "Phone number must be 10 digits");
        }
        // Validation for Email
        if (name === 'email') {
            const isValidEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
            setEmailError(isValidEmail ? "" : "Enter a valid email address");
        }
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

        // Validate confirm password
        if (name === 'confirmpassword') {
            // Ensure that it matches the password field
            const isMatchingPassword = value === data.password;
            setConfirmPasswordError(isMatchingPassword ? "" : "Passwords do not match");
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        signupApiCall(data);

    };

    const signupApiCall = (data) => {
        console.log(data)
        if (Object.keys(data).length === 0) {
            alert("Please fill the form");
            return;
        } else if (emailError !== "") {
            alert(emailError);
            return;
        } else if (phoneNumberError !== "") {
            alert(phoneNumberError);
            return;
        } else if (usernameError !== "") {
            alert(usernameError);
            return;
        } else if (passwordError !== "") {
            alert(passwordError);
            return;
        } else if (confirmPasswordError !== "") {
            alert(confirmPasswordError);
            return;
        } else if (!data || !data.email) {
            alert("Email is missing in the form");
            return;
        } else if (!data || !data.gender) {
            alert("Please select gender");
            return;
        } else if (!data || !data.number) {
            alert("Number is missing in the form");
            return;
        } else if (!data || !data.username) {
            alert("Username is missing in the form");
            return;
        } else if (!data || !data.password) {
            alert("Password is missing in the form");
            return;
        } else if (!data || !data.confirmpassword) {
            alert("Confirm Password is missing in the form");
            return;
        }

        setLoading(true);

        const url = "https://api.r-sharma.in/user/new-user"
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                sUserName: data.username,
                sEmailId: data.email,
                sPassword: data.password,
                sGender: data.gender,
                sPhoneNumber: data.number,
                bAccountActive: true,

            }),

        })
            .then(response => response.json())
            .then(data => {
                setPopupMessage(data.oBody && data.oBody.payLoad);
                setButtonPopup(true);
                clearForm();

            })
            .catch(error => {
                setPopupMessage("An error occurred while processing your request.");
            })
            .finally(() => {
                setLoading(false); // Set loading to false regardless of success or failure
            });
    }

    const clearForm = () => {
        setGender('');
        setData({
            email: '',
            gender: '',
            number: '',
            username: '',
            password: '',
            confirmpassword: '',
        });
        setLoading(false);
        setPhoneNumberError('');
        setEmailError('');
        setUsernameError('');
        setPasswordError('');
        setConfirmPasswordError('');
        setShowPassword(false);
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
                        <h3 className='text-center col-lg-7'>Sign Up</h3>
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
                            <Form.Group className="mb-3 col-lg-7" controlId="formBasicGender">
                                <Form.Select value={gender} name='gender' onChange={handleGenderChange}>
                                    <option value="" disabled>Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3 col-lg-7" controlId="formBasicNumber">
                                <Form.Control type="number" name='number' onChange={getdata} placeholder="Mobile Number" isInvalid={!!phoneNumberError} />
                                <Form.Control.Feedback type="invalid">
                                    {phoneNumberError}
                                </Form.Control.Feedback>
                            </Form.Group>
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
                            <Form.Group className="mb-3 col-lg-7" controlId="formBasicConfirmPassword">
                                <InputGroup>
                                    <Form.Control type={showPassword ? 'text' : 'password'} name='confirmpassword' onChange={getdata} placeholder="Confirm Password" isInvalid={!!confirmPasswordError} />
                                    <InputGroup.Text onClick={toggleShowPassword} style={{ cursor: 'pointer' }}>
                                        {showPassword ? <EyeSlash /> : <Eye />}
                                    </InputGroup.Text>
                                    <Form.Control.Feedback type="invalid">
                                        {confirmPasswordError}
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
                        <p className='mt-3'>Already Have an Account? <span> <NavLink to="/login">Sign In</NavLink></span></p>
                    </div>
                    {showSignImg && <SignImg />}
                </section>
            </div>
        </>
    )
}

export default Home