import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link, useNavigate } from 'react-router-dom';
import { MdEmail } from "react-icons/md";
import { BsFillShieldLockFill } from 'react-icons/bs'

// import assets
import '../../assets/css/Login.css';
import townhall from '../../assets/images/york-town-hall.jpg'
import mada from '../../assets/images/mada.png'

//import service
import { loginUser } from "../../services/loginService";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await loginUser({ email, password });
            
            if (response.status === 200) { // Authentification success, showing success message     
                setSuccessMessage('Authentication successful');
                setErrorMessage('');
                
                const { token, isAdmin } = response.data;
                localStorage.setItem('token', token); // Stocking token inside localStorage
                if (isAdmin) {
                    window.alert('Welcome Project Manager, you are logged in');
                } else {
                    window.alert('Welcome, you are logged in');
                }
                setTimeout(() => {
                    navigate('/home'); // Redirection to page Home after connexion
                }, 3000);
            } 
            else {// Authentification failed, showing an error message
                setErrorMessage(response.data.error || 'Authentication failed');
                setSuccessMessage('');
            }
        }
        catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage(error.response.data.error || 'Authentication failed');
            } 
            else if (error.response && error.response.status === 500) {
                setErrorMessage('Internal server error. Please try again later.');
            }
            else {
                setErrorMessage('An error occurred. Please try again.');
            }
            setSuccessMessage('');
        }
    };

    return (
        <div className="LoginPage flex">
            <div className="container flex">

                <div className="townhallDiv">
                    <img src={townhall} alt="townhall" />
                    <div className="footerDiv flex">
                        <span className="text">Don't have an account?</span>
                        <Link to="/register">
                            <button className="btn">Signup</button>
                        </Link>
                    </div>
                </div>
                <div className="formDiv flex">
                    <div className="headerDiv">
                        <img src={mada} alt="mada" />
                        <h3>Login</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="form grid">
                        {errorMessage && <p className="mt-3 text-danger errMess">{errorMessage}</p>}
                        {successMessage && <p className="mt-3 text-success succMess">{successMessage}</p>}   
                        <div className="form-group">
                            <label>Email Address</label>
                            <div className="input flex">
                                <MdEmail className="icon"/>
                                <input 
                                    type="email" 
                                    className="form-control"
                                    placeholder="Enter your Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required="required"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <div className="input flex">
                                <BsFillShieldLockFill className="icon"/>
                                <input 
                                    type="password" 
                                    className="form-control"
                                    placeholder="Enter Your Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required="required"
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn">Login</button>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default Login;