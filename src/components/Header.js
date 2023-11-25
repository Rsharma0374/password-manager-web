import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css'
import logo2 from '../images/logo2.png'

const Header = () => {
    const [menuVisible, setMenuVisible] = useState(false);


    const openMenu = () => {
        setMenuVisible(true);
    };

    const closeMenu = () => {
        setMenuVisible(false);
    };
    return (
        <>
            <div id="header">
                <div className="container">
                    <nav>
                        <img src={logo2} className="logo" alt="logo" />
                        <ul className={`sidemenu ${menuVisible ? 'open' : ''}`}>
                            <li><NavLink to='/' onClick={closeMenu}>Home</NavLink></li>
                            <li><NavLink to='/about' onClick={closeMenu}>About</NavLink></li>
                            <li><NavLink to='/contact' onClick={closeMenu}>Contact</NavLink></li>
                            <li onClick={closeMenu}><i className="fa-solid fa-x"></i></li>
                        </ul>
                        <i className="fa-solid fa-bars" onClick={openMenu}></i>
                    </nav>
                </div>
            </div>
        </>
    )
}

export default Header