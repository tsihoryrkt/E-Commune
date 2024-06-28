import React, { useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom';

// import assets
import '../../assets/css/Home.css';

// import service
import '../../services/homeService';
import fetchUserData from "../../services/homeService";

const Home = () => {
    const [ userData, setUserData ] = useState(null);
    const [ error, setError ] = useState('');
    const navigate = useNavigate();
    const baseUrl = 'http://localhost:5000/uploads';

    useEffect(() => {
        const getUserData = async () => {
            const token = localStorage.getItem('token');
            
            if(!token){ // if token isn't there, go back to login
                navigate('/login');
                return;
            }

            try{
                const data = await fetchUserData(token);

                setUserData(data);
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        setTimeout(() => {
            navigate('/login');
        }, 2000);
    };
    const handleAccount = () => {
        navigate('/account');
    }

    return (
        <div className="HomePage">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-4 col-md-3 vh-100">
                        <div className="mt-4 mb-4 text-center userProfile">
                            {userData.image && (
                                <span>
                                    <img 
                                        src={imageUrl} 
                                        alt={`${userData.name}'s profile`}
                                        className="img-fluid img-thumbnail rounded-circle" 
                                    />
                                </span>
                            )}      
                        
                            <div className="text-center mt-3 mb-3">
                                <div className="mt-3 mb-3" id="login_user_name">{ userData.name }</div>
                            </div>
                            <div className="text-center mt-3 mb-3">
                                <button className="btn btn-secondary btn-sm mx-1" onClick={handleAccount}>Account</button>
                                <button className="btn btn-primary btn-sm mx-1" onClick={handleLogout}>Logout</button>
                            </div>
                        </div>
                        <hr className="bg-secondary border-2 border-top border-secondary" />
                        <div className="mt-4 mb-4 overflow-auto">
                            <h6 className="border-bottom pb-2 mb-0">Mila asina zavatra ato</h6>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                        </div>
                    </div>

                    <div className="mb-4 col-md-6 vh-100 mainBoard">
                        <h3>welcome to project management</h3>
                        
        
                    </div>

                    <div className="col-sm-4 col-md-3 vh-100 border-start">
                        <div className="pt-4 pb-4 h-50 overflow-auto">
                            <h6 className="mb-3">ato ko mila apina adikle</h6>

                        </div>

                        <div className="pt-4 pb-4 h-50 overflow-auto">
                            <h6 className="mb-3">de mbola eto ko ry se an</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;