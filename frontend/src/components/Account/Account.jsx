import React,  { useEffect, useState}  from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom';

// import assets
import '../../assets/css/Account.css';

// import service
import fetchUserData from "../../services/homeService";
import { updateUserProfile } from '../../services/accountService';

const Account = () => {
    const [ userData, setUserData ] = useState(null);
    const [ error, setError ] = useState('');
    const navigate = useNavigate();
    const baseUrl = 'http://localhost:5000/uploads';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [image, setImage] = useState(null);

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');


    useEffect(() => {
        const getUserData = async () => {
            const token = localStorage.getItem('token');
            
            if(!token){ // if token isn't there, go back to login
                navigate('/login');
                return;
            }

            try{
                const data = await fetchUserData(token);

                // state initiate with the user data achieved
                setUserData(data);
                setName(data.name);
                setEmail(data.email);
                setMobileNumber(data.mobileNumber);
            }
            
            catch (error) {
 
                setError(error.message);
                if (error.message === 'Unauthorized. Please log in again.') {
                    navigate('/login');
                }
            }
        };
        getUserData();

    }, [navigate]);

    if (error) return <div>Error: {error}</div>;
    if (!userData) return <div>No user data available</div>;

    
    const imageUrl = `${baseUrl}/${userData.image}`;

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('mobileNumber', mobileNumber);

        if (image) {
            formData.append('image', image);
        }

        const token = localStorage.getItem('token');

        try {
            const response = await updateUserProfile(token, formData);


            if (response.status === 200){
                setErrorMessage('');
                setSuccessMessage('Update successful');
                window.alert('Profile updated successfully');
                navigate('/account');
            } 
            else {// update failed, showing an error message
                setErrorMessage(response.data.error || 'Authentication failed');
                setSuccessMessage('');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred. Please try again.');
        }
    };


    return (
        <div className="AccountPage flex">
            <dev className="container flex">
                <div className="setting">
                    <div className="formDiv flex">
                        <form onSubmit={updateProfile} className="p-4 p-md-5 border rounded-3 bg-light">
                            <h1 className="display-6 fw-bold mb-4 text-center">Setting</h1>
                            {errorMessage && <p className="mt-3 text-danger errMess">{errorMessage}</p>}
                            {successMessage && <p className="mt-3 text-success succMess">{successMessage}</p>}
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" value={name}  onChange={(e) => setName(e.target.value)} required/>
                                        <label htmlFor="name">Name</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                                        <label htmlFor="email">Email</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} required/>
                                        <label htmlFor="mobileNumber">Telephone</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input type="file" name="image" accept="image/x-png,image/gif,image/jpg,image/jpeg" onChange={handleImageChange}/>
                                        <input type="hidden" name="hidden_image" value={image}/>
                                        <span>
                                            <img 
                                                src={imageUrl} 
                                                alt={`${userData.name}'s profile`}
                                                className="img-fluid img-thumbnail"
                                            />
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="w-100 btn btn-lg btn-primary">Save</button>
                        </form>
                    </div>
                </div>
            </dev>
        </div>
                            
    )
}

export default Account;