import React,  { useEffect, useState}  from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { FaSearch } from "react-icons/fa";
import { FaHourglassStart } from "react-icons/fa";
import { FaHourglassEnd } from "react-icons/fa";


// import assets
import '../../assets/css/Task.css';

// import service
import fetchUserData, { fetchMembers } from "../../services/homeService";
import { searchProject } from "../../services/projectService";
import { createTask } from "../../services/taskService";

const Task = () => {

    const [ userData, setUserData ] = useState(null);
    const [ error, setError ] = useState('');
    const navigate = useNavigate();
    const baseUrl = 'http://localhost:5000/uploads';

    const [ id , setId ] = useState('');
    const [ title, setTitle ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ assignedTo, setAssignedTo ] = useState([]);
    const [ project, setProject ] = useState('');
    const [ status, setStatus ] = useState('');
    const [ dueDate, setDueDate ] = useState('');
    

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    //  For searching project
    const [ProjectSearchTerm, setProjectSearchTerm] = useState('');
    const [ProjectSearchResults, setProjectSearchResults] = useState('');
    const [allProjects, setAllProjects] = useState([]);
    const [showProjectSearchResult, setShowProjectSearchResult] = useState(false);

    const [selectedProject, setSelectedProject] = useState(null);
    const [ProjectId, setProjectId] = useState('');
    const [ProjectName, setProjectName] = useState('');
    const [ProjectDescription, setProjectDescription] = useState('');
    const [ProjectStartDate, setProjectStartDate] = useState('');
    const [ProjectEndDate, setProjectEndDate] = useState('');
    const [ProjectMembers, setProjectMembers] = useState([]);

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

                const allProjetcs = await searchProject(token, '');
                setAllProjects(allProjetcs);

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

    const handleCreateTask = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        if(!selectedProject){
            setErrorMessage('Please, select a project');
            setTimeout(()=> {
                setErrorMessage(null);
            }, 4000);
        }
        else{
            const strtDate = new Date(ProjectStartDate);
            const edDate = selectedProject.endDate ? new Date(ProjectEndDate) : null;
            const dueDateObj = new Date(dueDate);
            
            if(dueDateObj < strtDate){
                setErrorMessage('Due date must be after project start date');
                setTimeout(() => {
                    setErrorMessage('');
                }, 4000);
            }
            else if(edDate && (dueDateObj > edDate)){
                setErrorMessage('Due date must be before project end date');
                setTimeout(() => {
                    setErrorMessage('');
                }, 4000);
            }
            else{
                const formData = new FormData();
                formData.append('title', title);
                formData.append('description', description);
                formData.append('project', selectedProject._id);
                formData.append('dueDate', dueDate);

                const token = localStorage.getItem('token');

                try {
                    
                    const response = await createTask(token, formData);
                    if(response.status === 200){
                        setSuccessMessage('Task created');
                        setTimeout(() => {
                            setTitle('');
                            setDescription('')
                            setSelectedProject(null);
                            setDueDate('')
                        }, 1000);

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
            }
        }
    }

    const HandlesearchProject = async (event) => {
        if(event.key === 'Enter' || event.type === 'click') {
            event.preventDefault();
            
            try {
                const token = localStorage.getItem('token');
                const results = await searchProject(token, ProjectSearchTerm);
                setProjectSearchResults(results);
                setShowProjectSearchResult(false);
            }
            catch (error) {
                setErrorMessage('Error searching Project: ', error);
            };
        }
        else{
            try {
                const token = localStorage.getItem('token');
                const results = await searchProject(token, ProjectSearchTerm);
                setProjectSearchResults(results);
                setShowProjectSearchResult(true);
            }
            catch (error) {
                setErrorMessage('Error searching project: ', error);
            };
        }
    };

    const handleProjectClick = (project) => {
        setSelectedProject(project);
        setProjectId(project._id);
        setProjectName(project.name);
        setProjectStartDate(new Date(project.startDate).toISOString().slice(0, 10));
        setProjectEndDate(project.endDate ? new Date(project.endDate).toISOString().slice(0, 10) : '');
        
        fetchMembersDetails(project.members);
    }

    const fetchMembersDetails = async (membersId) => {
        try {
            const token = localStorage.getItem('token');
            const data = await fetchMembers(token, membersId);
            setProjectMembers(data);

        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
        };
    }

    const handleCancelSelectingProject = () => {
        setSelectedProject(null);
        setProjectId('');
        setProjectName('');
        setProjectStartDate('');
        setProjectEndDate('')
        setProjectMembers([]);
        setDueDate('');
    }

    return (
        <div className="TaskPage">
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
                <div className="container-fluid d-flex flex-wrap ps-0 justify-content-center align-items-center">

                    <div className="container-fluid d-flex justify-content-center align-items-center NewProject">
                        <div className="formDiv">
                            <h1 className="display-6 fw-bold mb-4 mt-2 text-center">New Task</h1>
                            {errorMessage && <p className="mt-3 text-danger errMess">{errorMessage}</p>}
                            {successMessage && <p className="mt-3 text-success succMess">{successMessage}</p>}                  
                            <form onSubmit={handleCreateTask} className="p-4 p-md-5 rounded-3 text-center">
                                <div className="row">

                                    <div className="col-md-6">
                                        <div className="form-floating mb-3">
                                            <input type="text" className="form-control" value={title}  onChange={(e) => setTitle(e.target.value)} required/>
                                            <label htmlFor="title">Title</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating mb-3">
                                            <input type="text" className="form-control" value={description}  onChange={(e) => setDescription(e.target.value)}/>
                                            <label htmlFor="name">Description</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="Project mb-3 p-3 rounded overflow-y-auto">
                                            <div className="sticky-top mb-2 d-flex align-items-center justify-content-between input-container">
                                                <input 
                                                    type="text" 
                                                    name="search_user" 
                                                    className="form-control"
                                                    placeholder="Assign to Project"
                                                    value={ProjectSearchTerm}
                                                    onChange={(e) => setProjectSearchTerm(e.target.value)}
                                                    onKeyDown={HandlesearchProject}
                                                />
                                                <button className="search-button" onClick={ HandlesearchProject }>
                                                    <FaSearch className="icon text-light"/>
                                                </button>
                                            </div>
                                            <div className="list-group">
                                                {!selectedProject ?
                                                    (ProjectSearchTerm ? (
                                                        ProjectSearchResults.length === 0 ?
                                                        (
                                                            <strong className="text-gray-dark">No project found</strong>
                                                        ) 
                                                        :
                                                        (
                                                            showProjectSearchResult ? (
                                                                ProjectSearchResults.map(project => (
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
                                                                ProjectSearchResults.map(project => (
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
                                                            allProjects.map(project => (
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
                                                    :
                                                    (
                                                        <div className="d-flex align-items-center justify-content-between text-center p-4 m-3">
                                                            <div className="f">
                                                                <strong>{ProjectName}</strong>
                                                            </div>
                                                            <button 
                                                                className="btn btn-danger"
                                                                onClick={handleCancelSelectingProject}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="ProjectDate">
                                            <div className="mb-3 mt-4 rounded-3 text-start">
                                                <p>
                                                    <FaHourglassStart />
                                                    {ProjectStartDate}
                                                </p>
                                            </div>
                                            <div className="form-floating">
                                                <input type="date" className="form-control d-flex text-center" value={dueDate}  onChange={(e) => setDueDate(e.target.value)}/>
                                                <label htmlFor="endDate">Due Date of the task</label>
                                            </div>
                                            <div className="mt-3 rounded-3 text-end">
                                                <p>
                                                    <FaHourglassEnd />
                                                    {ProjectEndDate}
                                                </p>
                                            </div>                                        
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="px-5 btn btn-lg btn-primary"><HiOutlineDocumentAdd /> Add</button>
                            </form>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}

export default Task;