import React, { useState } from 'react';
import Popup from '../popup/Popup';
import '../popup/Popup.css';

const OtpPopup = ({ onSubmit }) => {
    const [otp, setOtp] = useState('');

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    const handleSubmit = () => {
        onSubmit(otp);
    };

    return (
        <Popup trigger={true}>
            <h2>Please enter OTP</h2>
            <input type="text" value={otp} onChange={handleOtpChange} />
            <button onClick={handleSubmit}>Submit OTP</button>
        </Popup>
    );
};

export default OtpPopup;
