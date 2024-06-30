import React, { useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';


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

    return (
        <div className="HomePage">
            <div className="container-fluid">
                <Navbar className="" expand="lg">
                    <Container>    
                        <Navbar.Brand href="/home">E-Commune</Navbar.Brand>
                        
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />                    
                        
                        <Navbar.Collapse id="basic-navbar-nav">
                                
                            <Nav className="me-auto">
                                {userData.isAdmin && (
                                    <Nav.Link href="/project" className="text-dark">Project</Nav.Link>
                                )}
                                {userData.isAdmin && (
                                    <Nav.Link href="/task" className="text-dark">Tasks</Nav.Link>
                                )}
                            </Nav>
                            <Nav>
                                <Nav.Link href="/account" className="text-dark">Account</Nav.Link>
                                <Nav.Link onClick={handleLogout} className="text-dark">Logout</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>

                    </Container>
                </Navbar>

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
                        </div>
                        <hr className="bg-secondary border-2 border-top border-secondary" />
                        <div className="mt-4 mb-4 overflow-auto">
                            <h6 className="border-bottom pb-2 mb-0">Mes projets</h6>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                        </div>
                    </div>

                    <div className="mb-4 col-md-6 vh-100 mainBoard">
                        
        
                    </div>

                    <div className="col-sm-4 col-md-3 vh-100 border-start">
                        <div className="pt-4 pb-4 h-50 overflow-auto">
                            <h6 className="mb-3">Contributor</h6>

                        </div>

                        <div className="pt-4 pb-4 h-50 overflow-auto">
                            <h6 className="mb-3">Statistics</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;