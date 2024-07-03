import React, { useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaSearch } from "react-icons/fa";


// import assets
import '../../assets/css/Home.css';

// import service
import fetchUserData from "../../services/homeService";
import { searchProject } from "../../services/homeService";
import { fetchMembers } from "../../services/homeService";

const Home = () => {
    const [ userData, setUserData ] = useState(null);
    const [ error, setError ] = useState('');
    const navigate = useNavigate();
    const baseUrl = 'http://localhost:5000/uploads';

    const [ id , setId ] = useState('');
    const [ name, setName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ members, setMembers ] = useState([]);
    const [ startDate, setStartDate ] = useState('');
    const [ endDate, setEndDate ] = useState('');

    const [errorMessage, setErrorMessage] = useState('');


    // For searching project
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState('');
    const [MyProjects, setMyProjects] = useState([]);
    const [showSearchResult, setShowSearchResult] = useState(false);


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
            
                const allProjetcs = await searchProject(token, '');
                setMyProjects(allProjetcs);
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

    const HandlesearchProject = async (event) => {
        if(event.key === 'Enter' || event.type === 'click') {
            event.preventDefault();
            
            try {
                const token = localStorage.getItem('token');
                const results = await searchProject(token, searchTerm);
                setSearchResults(results);
                setShowSearchResult(false);
            }
            catch (error) {
                setErrorMessage('Error searching Project: ', error);
            };
        }
        else{
            try {
                const token = localStorage.getItem('token');
                const results = await searchProject(token, searchTerm);
                setSearchResults(results);
                setShowSearchResult(true);
            }
            catch (error) {
                setErrorMessage('Error searching project: ', error);
            };
        }
    };
    const handleProjectClick = (project) => {
        setId(project._id)
        setName(project.name);
        setDescription(project.description);
        setStartDate(new Date(project.startDate).toISOString().slice(0, 10));
        setEndDate(new Date(project.endDate).toISOString().slice(0, 10));

        fetchMembersDetails(project.members);

    }
    const fetchMembersDetails = async (membersId) => {
        try {
            const token = localStorage.getItem('token');
            const data = await fetchMembers(token, membersId);
            setMembers(data);

        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
        };
    }



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
                                <Nav.Link href="/account" className="text-dark">Account</Nav.Link>
                            </Nav>
                            <Nav>
                                <Nav.Link onClick={handleLogout} className="text-dark">Logout</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>

                    </Container>
                </Navbar>

                <div className="row text-center">
                    <div className="col-md-3 text-center">
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
                        <div className="mt-4 mb-4 text-center MyProject ">
                            <h1 className="pb-2 mb-0">My projects</h1>
                            {errorMessage && <p className="mt-3 text-danger errMess">{errorMessage}</p>}

                            <div className="p-4 mt-3 mx-3 border rounder-3 bg-light ProjectList ">
                                <div className="sticky-top d-flex align-items-center justify-content-between input-container">
                                    <input 
                                            type="text" 
                                            name="search_user" 
                                            className="search-input"
                                            placeholder="Search Project"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyDown={HandlesearchProject}
                                    />
                                    <button className="search-button">
                                        <FaSearch className="icon"/>
                                    </button>
                                </div>
                                <div className="mt-3 list-group">
                                {searchTerm ? (
                                    searchResults.length === 0 ?
                                    (
                                        <strong className="text-gray-dark">No project found</strong>
                                    ) 
                                    :
                                    (
                                        showSearchResult ? (
                                            searchResults.map(project => (
                                                <div key={project._id} onClick={() => handleProjectClick(project)}>
                                                    <div className="list-group-item list-group-item-action user-list-item rounded-3">                                            
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div className="mb-1">
                                                                {project.name}
                                                            </div>                                            
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )
                                        :
                                        (
                                            searchResults.map(project => (
                                                <div>
                                                    <div key={project._id} onClick={() => handleProjectClick(project)}>
                                                        <div className="list-group-item list-group-item-action user-list-item rounded-3">                                            
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <div className="mb-1">
                                                                    {project.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                                                                        
                                        )
                                    )
                                    )
                                    :
                                    (
                                        MyProjects.map(project => (
                                            <div>
                                                <div key={project._id} onClick={() => handleProjectClick(project)}>
                                                    <div className="list-group-item list-group-item-action user-list-item rounded-3">                                            
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div className="mb-1">
                                                                {project.name}
                                                            </div>
                                                            
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )

                                }
                            </div>    
                            
                            </div>
                        </div>
                    </div>

                    <div className="mb-4 col-md-6 mainBoard">
                        
        
                    </div>

                    <div className="col-md-3">
                        <div className="pt-4 pb-4 overflow-auto">
                            <h6 className="mb-3">My Task</h6>

                        </div>

                        <div className="pt-4 pb-4 overflow-auto">
                            <h6 className="mb-3">Statistics</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;