import React, { useState } from 'react'
import "./Login.css"
// import name_transparent_2 from "../../../public/images/logos/name_transparent_2.png"
// import google_logo from "../../../public/images/logos/google_logo.png"
import { auth, provider } from '../../firebase';
import userSlice, { selectUser } from '../../features/userSlice';
import { sendEmailVerification, sendSignInLinkToEmail } from 'firebase/auth'
import Register from './Register';
import { BrowserRouter, Route, Routes, Link, useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import { authUser } from '../../App'
import { useSelector } from 'react-redux';

function Login() {

    // const user = useSelector(selectUser);

    // const navigate = useNavigate();
    // const navRegister = () => {
    //     navigate('/register')
    // }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signIn = () => {
        auth.signInWithPopup(provider)
            .catch((e) => alert(e.message));
    }

    const handleLogin = (e) => {
        e.preventDefault()
        auth.signInWithEmailAndPassword(email, password)
            .then((auth) => {
                console.log(auth)
            })
            .catch((e) => alert(e.message))

        setEmail("");
        setPassword("");
    }

    const handleRegister = (e) => {
        e.preventDefault()
        auth.createUserWithEmailAndPassword(email, password)
            // await auth.user.sendEmailVerification()
            .then((auth) => {

                if (auth) {
                    console.log(auth)
                }
            })
            .catch((e) => alert(e.message))

        setEmail("");
        setPassword("");
    }




    // const RouteRegister = (e) => {
    //     <Router>
    //         <Routes>
    //             <Route path="/Register" element={Register} />
    //         </Routes>
    //     </Router>
    // }

    return (
        <div className='login'>
            <BrowserRouter>
                <div className='login_container'>
                    <div className='login_top'>
                        <div className='login_logo'>
                            <img src='/images/logos/name_transparent_2.png' alt='logo' />
                        </div>
                        <div className='logo_tagline'>
                            <span className='logo_tagline_text'>
                                A place to share knowledge and know your Institute well❤️
                            </span>
                        </div>
                    </div>

                    <div className='login_auth'>
                        <div className='login_auth_options'>
                            <div className='login_auth_option' onClick={signIn}>
                                <img src='/images/logos/google_logo.png' />
                                <span className='auth_text'>
                                    Continue with Google
                                </span>
                            </div>
                        </div>

                        <div className='loginSetUp'>
                            <span className='signin_text'>Sign in to your Account</span>
                            <div className='login_inpFields'>
                                <div className='login_inpField'>
                                    <input
                                        value={email} onChange={(e) => setEmail(e.target.value)}
                                        type='text' placeholder='Enter email' />
                                </div>
                                <div className='login_inpField'>
                                    <input
                                        value={password} onChange={(e) => setPassword(e.target.value)}
                                        type='password' placeholder='Enter password' />
                                </div>
                            </div>
                            <div className='button_container'>
                                <button type="submit" onClick={handleLogin}> Login</button>
                                <button type="submit" onClick={handleRegister}> Register</button>
                            </div>

                            <span className='forgot_link'>Forgot Password?</span>

                            {/* <Routes>
                                <Route path="/register" element={<Register />} />
                            </Routes> */}

                            <span className='register_link' >  Don't have an account? Click Here! </span >

                        </div>
                    </div>
                </div>
            </BrowserRouter>
        </div>
    )
}

export default Login
