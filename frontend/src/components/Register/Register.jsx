import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link, useNavigate } from 'react-router-dom';
import { FaUserShield } from 'react-icons/fa'
import { FaImage } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { BsTelephoneFill } from "react-icons/bs";
import { BsFillShieldLockFill } from 'react-icons/bs'

// import assets
import '../../assets/css/Register.css';
import townhall from '../../assets/images/rova.jpg'
import mada from '../../assets/images/mada.png'

//import service
import { registerUser } from "../../services/registerService";


const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('mobileNumber', mobileNumber);
        formData.append('password', password);
        formData.append('image', e.target.image.files[0]);
        formData.append('isAdmin', isAdmin); // Adding admin status to FormData

        try {
            const response = await registerUser(formData);
            if (response.status === 200) {
                setSuccessMessage(`Welcome to E-commune ${name}, please login`);
                window.alert(`${name}, registration successfuly`);
                setErrorMessage('');
                setTimeout(() => {
                    setName('');
                    setEmail('');
                    setMobileNumber('');
                    setPassword('');
                    setSuccessMessage('');
                    navigate('/login');
                }, 5000);
            }
            else {
                setErrorMessage('Registration failed');
                setSuccessMessage('');
            }
        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
            setSuccessMessage('');
        };

    }
    return (
        <div className="RegisterPage flex">
            <div className="container flex">

                <div className="townhallDiv">
                    <img src={townhall} alt="townhall" />
                    <div className="footerDiv flex">
                        <span className="text">Already have an account?</span>
                        <Link to="/login">
                            <button className="btn">Login</button>
                        </Link>
                    </div>
                </div>
                <div className="formDiv flex">
                    <div className="headerDiv">
                        <img src={mada} alt="mada" />
                        <h3>Register</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="form grid">
                    {errorMessage && <p className="mt-3 text-danger">{errorMessage}</p>}
                    {successMessage && <p className="mt-3 text-success">{successMessage}</p>}
                        <div className="form-group">
                            <label>Enter Name</label>
                            <div className="input flex">
                                <FaUserShield className="icon"/>
                                <input 
                                    type="text" 
                                    className="form-control"
                                    placeholder="Enter your Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required="required"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Select Your Profile</label>
                            <div className="input flex">      
                                <FaImage className="icon"/>  
                                <input 
                                    type="file" 
                                    className="form-control"
                                    name="image"
                                    placeholder="Input Image File"
                                />
                            </div>
                        </div>
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
                            <label>Mobile Number</label>
                            <div className="input flex">
                                <BsTelephoneFill className="icon"/>
                                <input 
                                    type="text" 
                                    className="form-control"
                                    placeholder="Enter Your Mobile Number"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
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
                        <div className="form-group form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="isAdminCheckbox"
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="isAdminCheckbox">Register as Project Manager</label>
                        </div>
                        <button type="submit" className="btn">Register</button>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default Register