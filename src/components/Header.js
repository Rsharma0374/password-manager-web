import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import './Header.css'

const Header = () => {
    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand >Password Manager</Navbar.Brand>
                    <Nav className="me-auto">
                        <NavLink to='/' className="navlink-home"> Home</NavLink>
                        <NavLink to='/contact' className="navlink-contact"> Contact</NavLink>
                        <NavLink to='/about' className="navlink-about"> About Us</NavLink>
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
}

export default Header