import React,  { useEffect, useState}  from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { FaSearch } from "react-icons/fa";
import { FaHourglassStart } from "react-icons/fa";
import { FaHourglassEnd } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { MdPending, MdPlayArrow, MdDone } from "react-icons/md";


// import assets
import '../../assets/css/Task.css';

// import service
import fetchUserData, { fetchMembers, fetchAssignedTo, fetchProject } from "../../services/homeService";
import { searchProject } from "../../services/projectService";
import { createTask } from "../../services/taskService";
import { searchTask } from "../../services/taskService";
import { updateTask } from "../../services/taskService";
import { deleteTask } from "../../services/taskService";

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
    const [ ProjectMembers, setProjectMembers ] = useState('');
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
    const [ProjectName, setProjectName] = useState('');
    const [ProjectStartDate, setProjectStartDate] = useState('');
    const [ProjectEndDate, setProjectEndDate] = useState('');

    //  For searching task
    const [searchTerm, setSearchTerm] = useState('');    
    const [searchResults, setSearchResults] = useState('');
    const [allTask, setAllTask] = useState([]);
    const [showSearchResult, setShowSearchResult] = useState(false);

    // For editing task
    const [ showEdit, setShowEdit ] = useState(false);

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

                const allTasks = await searchTask(token, '');
                setAllTask(allTasks);

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
                        setErrorMessage('failed to create task');
                    }
                    const allTasks = await searchTask(token, '');
                    setAllTask(allTasks);
                    setSearchTerm('');
                    setSearchResults('');

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
        setProjectName(project.name);
        setProjectStartDate(new Date(project.startDate).toISOString().slice(0, 10));
        setProjectEndDate(project.endDate ? new Date(project.endDate).toISOString().slice(0, 10) : '');        
    }

    const handleCancelSelectingProject = () => {
        setSelectedProject(null);
        setProjectName('');
        setProjectStartDate('');
        setProjectEndDate('')
        setDueDate('');
    }

    const HandleSearchTask = async (event) => {
        if(event.key === 'Enter' || event.type === 'click') {
            event.preventDefault();
            
            try {
                const token = localStorage.getItem('token');
                const results = await searchTask(token, searchTerm);
                setSearchResults(results);
                setShowSearchResult(false);
            }
            catch (error) {
                setErrorMessage('Error searching Task: ', error);
            };
        }
        else{
            try {
                const token = localStorage.getItem('token');
                const results = await searchTask(token, searchTerm);
                setSearchResults(results);
                setShowSearchResult(true);
            }
            catch (error) {
                setErrorMessage('Error searching Task: ', error);
            };
        }
    };

    const handleAddTask = () => {
        setShowEdit(false);
        setId('');
        setTitle('');
        setDescription('');
        setSelectedProject(null);
        setDueDate(''); 
    }

    const handleEditTask = async (event, taskId) => {
        event.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        const strtDate = new Date(project.startDate);
        const edDate = project.endDate ? new Date(project.endDate) : null; 
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
            formData.append('assignedTo', JSON.stringify(assignedTo.map(member => member._id)));
            formData.append('status', status);
            formData.append('dueDate', dueDate);

            const token = localStorage.getItem('token');
            try {
                await updateTask(token, formData, taskId)
                setSuccessMessage('Task updated');
                setErrorMessage('');
            
                const allTasks = await searchTask(token, '');
                setAllTask(allTasks);
                setSearchTerm('');
                setSearchResults('');

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

    const handleTaskClick = async (task) => {
        setShowEdit(true);
        setId(task._id);
        setTitle(task.title);
        setDescription(task.description || '');
        setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : '');
        setStatus(task.status);
        
        try {
            const token = localStorage.getItem('token');
            
            // Fetch project details
            const projectdata = await fetchProject(token, task.project);
            setProject(projectdata);

            // Fetch assigned members details
            const assignedToData = await fetchAssignedTo(token, task.assignedTo);
            setAssignedTo(assignedToData);
            
            // Fetch project members
            const projectMembersData = await fetchMembers(token, projectdata.members);
            setProjectMembers(projectMembersData);

        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
            setSuccessMessage('');
        }
    }

    const handleRemoveAssignedTo = (memberId) => {
        setAssignedTo(assignedTo.filter(member => member._id !== memberId));
        if(assignedTo.length === 1)
            setStatus('Pending');
    };

    const handleAddAssignedTo = (memberId) => {
        const member = ProjectMembers.find(member => member._id === memberId);
        if (member) {
            setAssignedTo([...assignedTo, member]);
            setStatus('In Progress');
        }
    };

    const handleDeleteTask = async (taskId) => {
        const token = localStorage.getItem('token');
        setSuccessMessage('');
        setErrorMessage('');

        try {
            await deleteTask(token, taskId);
            setSuccessMessage('Task deleted successfully');

            const allTasks = await searchTask(token, '');
            setAllTask(allTasks);
            setSearchTerm('');
            setSearchResults('');
            handleAddTask();

        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to delete Task');
            setSuccessMessage('');
        }
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
                <div className="container-fluid d-flex ps-0 justify-content-center align-items-center">

                    <div className={`container-fluid d-flex justify-content-center align-items-center ${showEdit ? 'hideItems' : ''} NewProject`}>
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
                                                <label htmlFor="endDate">Task due Date</label>
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

                    <div className={`container-fluid d-flex justify-content-center align-items-center ${showEdit ? '' : 'hideItems'} EditTask`}>
                        <div className="formDiv">
                            <h1 className="display-6 fw-bold mb-4 mt-2 text-center">Edit Task</h1>
                            {errorMessage && <p className="mt-3 text-danger errMess">{errorMessage}</p>}
                            {successMessage && <p className="mt-3 text-success succMess">{successMessage}</p>}
                        
                            <form onSubmit={(event) => handleEditTask(event, id)} className="border rounded-3 text-center">
                                <div className="editWrap p-4 p-md-5 ">
                                    <div className="mb-3">
                                        <h2 className="ProjectName">
                                            {project.name}
                                        </h2>
                                    </div>
                                    <div className="mx-5 mb-2">
                                        <input type="text" className="p-3 rounded-pill form-control text-center" value={title}  onChange={(e) => setTitle(e.target.value)} required/>
                                    </div>
                                    <div className="mb-3">
                                        <textarea type="text" className="p-3 rounded-pill form-control text-center" value={description}  onChange={(e) => setDescription(e.target.value)}/>
                                    </div>
                                    <div className="mb-3 row MembersProject d-flex text-center">
                                        <h4 className="p-1 text-light text-start">Asigned to: </h4>
                                        <div className="col-md-6 p-2">
                                            <div className="AssignedTo rounded-3">
                                                {assignedTo.length === 0 ? (
                                                    <strong className="text-light">No assigned member</strong>
                                                    )
                                                    :
                                                    (assignedTo.map(assignedTo => (
                                                        <div key={assignedTo._id} className="p-2 d-flex align-items-center justify-content-between">
                                                            <div className="text-light">
                                                                <img 
                                                                    src={`${baseUrl}/${assignedTo.image}`} 
                                                                    alt="" 
                                                                    className="rounded-circle me-3" 
                                                                />
                                                                {assignedTo.name}
                                                            </div>
                                                            <button 
                                                                className="btn btn-danger btn-sm ms-2"
                                                                onClick={() => handleRemoveAssignedTo(assignedTo._id)}    
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    ))

                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className="col-md-6 p-2">
                                            <div className="Members rounded-3">
                                                {ProjectMembers.length === 0 ? (
                                                    <strong className="text-light">No project member</strong>
                                                    )
                                                    :
                                                    (
                                                    ProjectMembers.filter(projectMember => !assignedTo.find(m => m._id === projectMember._id)).map(member => (
                                                        <div key={member._id} className="p-2 d-flex align-items-center justify-content-between">
                                                            <div className="text-light">
                                                                <img 
                                                                    src={`${baseUrl}/${member.image}`} 
                                                                    alt="" 
                                                                    className="rounded-circle me-3" 
                                                                />
                                                                {member.name} 
                                                            </div>
                                                            <button  
                                                                className="btn btn-primary btn-sm ms-2"
                                                                onClick={() => handleAddAssignedTo(member._id)}
                                                            >
                                                                Add
                                                            </button>
                                                        </div>
                                                    ))
                                                    )
                                                } 
                                            </div>
                                        </div>
                                    </div>
                                    <div className=" row mb-3">
                                        <div className="TaskDuedate col-md-6">
                                            <label htmlFor="dueDate" className="">Due Date</label>
                                            <input type="date" className="form-control rounded-pill" value={dueDate}  onChange={(e) => setDueDate(e.target.value)}/>
                                            <div className="d-flex justify-content-between mt-3">
                                                <div className="rounded-3 text-start text-light">
                                                    <p>
                                                        <FaHourglassStart />
                                                        {project.startDate ? new Date(project.startDate).toISOString().slice(0, 10) : ''}
                                                    </p>
                                                </div>
                                                <div className={`rounded-3 text-end ${project.endDate ? "text-light" : ''}`}>
                                                    <p>
                                                        <FaHourglassEnd />
                                                        {project.endDate ? new Date(project.endDate).toISOString().slice(0, 10) : ''}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="TaskStatus col-md-6">
                                            <label htmlFor="status">
                                                Status <span>                                                 
                                                    {status === "Pending" && <MdPending style={{ color: '#FF6347' }}/>}
                                                    {status === "In Progress" && <MdPlayArrow style={{ color: '#0D6EFD' }}/>}
                                                    {status === "Completed" && <MdDone style={{ color: '#32CD32' }}/>}
                                                </span>
                                            </label>
                                            <select className="form-select rounded-pill" value={status} onChange={(e) => setStatus(e.target.value)}>
                                                {assignedTo.length === 0 && <option value="Pending" className="">Pending</option>}
                                                {assignedTo.length > 0 && <option value="In Progress">In Progress</option>}
                                                {assignedTo.length > 0 && <option value="Completed">Completed</option>}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-lg btn-primary m-3 px-5">Save<MdEdit /></button>
                            </form>
                        </div>
                    </div>

                    <div className="AllTask mt-3">
                        <div className={`${showEdit ? '' : 'hideItems'}`}>
                            <button className="btn btn-outline-primary" onClick={() => handleAddTask()}>
                                Add Task
                            </button>
                        </div>
                        <div className="p-4 mt-3 border rounder-3 bg-light TaskList">
                            <div className="sticky-top d-flex align-items-center justify-content-between input-container">
                                <input 
                                    type="text" 
                                    name="search_task" 
                                    className="search-input"
                                    placeholder="Search Task"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={HandleSearchTask}
                                />
                                <button className="search-button" onClick={HandleSearchTask}>
                                    <FaSearch className="icon"/>
                                </button>
                            </div>
                            <div className="mt-3 list-group">
                                {searchTerm ? (
                                    searchResults.length === 0 ?
                                    (
                                        <strong className="text-gray-dark">No task found</strong>
                                    ) 
                                    :
                                    (
                                        showSearchResult ? (
                                            searchResults.map(task => (
                                                <div key={task._id} onClick={() => handleTaskClick(task)}>
                                                    <div className="list-group-item list-group-item-action user-list-item rounded-3">                                            
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div className="mb-1">
                                                                {task.title}
                                                            </div>                                            
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )
                                        :
                                        (
                                            searchResults.map(task => (
                                                <div>
                                                    <div key={task._id} onClick={() => handleTaskClick(task)}>
                                                        <div className="list-group-item list-group-item-action user-list-item rounded-3">                                            
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <div className="mb-1">
                                                                    {task.status === "Pending" && <MdPending style={{ color: '#FF6347', fontSize: '30px' }}/>}
                                                                    {task.status === "In Progress" && <MdPlayArrow style={{ color: '#0D6EFD', fontSize: '30px' }}/>}
                                                                    {task.status === "Completed" && <MdDone style={{ color: '#32CD32', fontSize: '30px' }}/>}
                                                                    {" " + task.title}
                                                                </div>
                                                                <div>
                                                                    <button 
                                                                        className="btn btn-outline-danger"
                                                                        onClick={() => handleDeleteTask(task._id)}    
                                                                    >
                                                                    Delete
                                                                    </button>                                            
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
                                        allTask.map(task => (
                                            <div>
                                                <div key={task._id} onClick={() => handleTaskClick(task)}>
                                                    <div className="list-group-item list-group-item-action user-list-item rounded-3">                                            
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div className="mb-1">
                                                                {task.status === "Pending" && <MdPending style={{ color: '#FF6347', fontSize: '30px'}}/>}
                                                                {task.status === "In Progress" && <MdPlayArrow style={{ color: '#0D6EFD', fontSize: '30px' }}/>}
                                                                {task.status === "Completed" && <MdDone style={{ color: '#32CD32', fontSize: '30px' }}/>}
                                                                {" " + task.title}
                                                            </div>
                                                            <div>
                                                                <button 
                                                                    className="btn btn-outline-danger"
                                                                    onClick={() => handleDeleteTask(task._id)}    
                                                                >
                                                                Delete
                                                                </button>                                            
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
            </div>
        </div>
    );
}

export default Task;