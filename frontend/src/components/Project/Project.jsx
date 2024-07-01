import React,  { useEffect, useState}  from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaSearch } from "react-icons/fa";

// import assets
import '../../assets/css/Project.css';

// import service
import fetchUserData from "../../services/homeService";
import { createProject } from "../../services/projectService";

const Project = () => {

    const [ userData, setUserData ] = useState(null);
    const [ error, setError ] = useState('');
    const navigate = useNavigate();

    const [ name,setName ] = useState('');
    const [ description,setDescription ] = useState('');
    const [ endDate,setEndDate ] = useState('');


    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // For searching project
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState('');
    const [allProjects, setAllProjects] = useState([]);
    const [selecteProject, setSelectedProject] = useState(null);

    
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
            }
            
            catch (error) {
 
                setError(error.message);
                if (error.message === 'Unauthorized. Please log in again.') {
                    navigate('/login');
                }
            }
        };
        getUserData();

    },[navigate]);

    if (error) return <div className="mt-3 text-danger errMess">mivrin   Error: {error}</div>;
    if (!userData) return <div className="mt-3 text-danger errMess">No user data available</div>;


    const handleLogout = () => {
        localStorage.removeItem('token');
        setTimeout(() => {
            navigate('/login');
        }, 2000);
    };

    const handleCreateProject = async (e) => {
        setErrorMessage('');
        setSuccessMessage('');
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('endDate', endDate);
        

        const token = localStorage.getItem('token');

        try {

            const response = await createProject(token, formData);
                if (response.status === 200) {
                    setErrorMessage('');
                    setSuccessMessage('Project created successfully');
                    setTimeout(() => {
                        setName('');
                        setDescription('');
                        setEndDate('');
                    }, 2000);
                }
                else {
                    setSuccessMessage('');
                    setErrorMessage('failed to create project');
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


    };

    return (
        <div className="ProjectPage">
            <div className="container">

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
                <div className="container-fluid d-flex justify-content-center align-items-center">
                    <div className="container-fluid d-flex justify-content-center align-items-center NewProject">
                        <div className="formDiv">
                            <h1 className="display-6 fw-bold mb-4 mt-2 text-center">New Project</h1>
                            {errorMessage && <p className="mt-3 text-danger errMess">{errorMessage}</p>}
                            {successMessage && <p className="mt-3 text-success succMess">{successMessage}</p>}
                            <form onSubmit={handleCreateProject} className="p-4 p-md-5 border rounded-3 bg-light">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-floating mb-3">
                                            <input type="text" className="form-control" value={name}  onChange={(e) => setName(e.target.value)} required/>
                                            <label htmlFor="name">Name</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating mb-3">
                                            <input type="text" className="form-control" value={description}  onChange={(e) => setDescription(e.target.value)}/>
                                            <label htmlFor="name">Description</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating mb-3">
                                            <input type="date" className="form-control" value={endDate}  onChange={(e) => setEndDate(e.target.value)}/>
                                            <label htmlFor="endDate">End Date</label>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="w-100 btn btn-lg btn-primary">Save</button>
                           </form>
                        </div>
                    </div>

                    <div className="AllProject mt-3">
                        <div className="p-4 mt-3 border rounder-3 bg-light ProjectList">
                            <div className="sticky-top d-flex align-items-center justify-content-between input-container">
                                <input 
                                    type="text" 
                                    name="search_user" 
                                    className="search-input"
                                    placeholder="Search Project"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button className="search-button">
                                    <FaSearch className="icon"/>
                                </button>
                            </div>
                            <div className="mt-3 list-group">
                            </div>
                        </div>          
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Project;