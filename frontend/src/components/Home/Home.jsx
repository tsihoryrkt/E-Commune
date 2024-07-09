import React, { useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaSearch } from "react-icons/fa";
import { FaHourglassStart } from "react-icons/fa";
import { FaHourglassEnd } from "react-icons/fa";
import { MdPending, MdPlayArrow, MdDone } from "react-icons/md";
import { FcStatistics } from "react-icons/fc";
import { GoProject } from "react-icons/go";
import { GoTasklist } from "react-icons/go";
import { FaUsers } from "react-icons/fa";

// import assets
import '../../assets/css/Home.css';
import conseil from '../../assets/images/conseil-municipal.jpeg'

// import service
import fetchUserData from "../../services/homeService";
import { searchProject } from "../../services/homeService";
import { fetchMembers } from "../../services/homeService";
import { fetchProjectTask } from "../../services/homeService";
import { searchTask } from "../../services/homeService";
import { fetchProjectCount, fetchUserCount, fetchTaskStats } from "../../services/homeService";

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

    const [ projectTask, setProjectTask ] = useState([]);

    const [ errorMessage, setErrorMessage ] = useState('');
    const [ showProject, setShowProject ] = useState(false);


    // For searching project
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState('');
    const [MyProjects, setMyProjects] = useState([]);
    const [showSearchResult, setShowSearchResult] = useState(false);

    // For searching task
    const [taskSearchTerm, setTaskSearchTerm] = useState('');
    const [taskSearchResults, setTaskSearchResults] = useState('');
    const [MyTasks, setMyTasks] = useState([]);
    const [showTaskSearchResult, setShowTaskSearchResult] = useState(false);

    // For statistics
    const [projectCount, setProjectCount] = useState('');
    const [userCount, setUserCount] = useState(0);
    const [taskStats, setTaskStats] = useState({
        totalTasks: 0,
        pendingTasks: 0,
        inProgerssTasks: 0,
        completedTasks: 0,
    });

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

                const allTask = await searchTask(token, '');
                setMyTasks(allTask);

                const projectC = await fetchProjectCount();
                setProjectCount(projectC);

                const userC = await fetchUserCount();
                setUserCount(userC);

                const taskS = await fetchTaskStats();
                setTaskStats(taskS);
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

    const handleProjectClick = async (project) => {
        setId(project._id)
        setName(project.name);
        setDescription(project.description);
        setStartDate(new Date(project.startDate).toISOString().slice(0, 10));
        setEndDate(project.endDate ? new Date(project.endDate).toISOString().slice(0, 10) : '');

        setShowProject(true);

        try {
            const token = localStorage.getItem('token');

            // Fetch project members
            const membersData = await fetchMembers(token, project.members);
            setMembers(membersData);

            // Fetch project task
            const taskData = await fetchProjectTask(token, project._id);
            setProjectTask(taskData);

        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
        };

    }

    const HandleSearchTask = async (event) => {
        if(event.key === 'Enter' || event.type === 'click') {
            event.preventDefault();
            
            try {
                const token = localStorage.getItem('token');
                const results = await searchTask(token, taskSearchTerm);
                setTaskSearchResults(results);
                setShowTaskSearchResult(false);
            }
            catch (error) {
                setErrorMessage('Error searching Task: ', error);
            };
        }
        else{
            try {
                const token = localStorage.getItem('token');
                const results = await searchTask(token, taskSearchTerm);
                setTaskSearchResults(results);
                setShowTaskSearchResult(true);
            }
            catch (error) {
                setErrorMessage('Error searching Task: ', error);
            };
        }
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

                            <div className="p-4 mt-3 mx-3 border rounded-3 bg-light ProjectList">
                                <div className="rounded-3 sticky-top d-flex align-items-center justify-content-between input-container">
                                    <input 
                                            type="text" 
                                            name="search_user" 
                                            className="search-input rounded-3"
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

                    <div className="mb-4 col-md-6 text-center d-flex justify-content-center align-items-center mainBoard">

                        <div className={ `WelcomeUser rounded-3 text-center d-flex justify-content-text-center d-flex justify-content-center align-items-centercenter align-items-center ${showProject ? 'hideItems' : '' }`}>
                            <div className="rounded-4 p-3 m-5">
                                <img 
                                    src={conseil} 
                                    alt="Municipal conseil"
                                    className="rounded-3"     
                                />
                                <p className="p-4">Welcome to <strong>E-Commune</strong> Project Management</p>
                            </div>
                        </div>
                        <div className={`ProjectInfo p-4 p-md-5 m-3 rounded-3 text-center ${showProject ? '' : 'hideItems'}`}>
                            <div className="Name mb-3 mx-auto rounded-4 p-2 text-center">
                                {name}
                            </div>
                            <div className="Description rounded-4 p-3 mb-3">
                                {description}
                            </div>
                            
                            <div className="row">
                                <div className="col-md-6">
                                    <h2 className="text-light">Members:</h2>
                                    <div className="Members rounded-3 d-flex flex-wrap justify-content-center overflow-y-auto mb-3">
                                        { members.map(member => (
                                            <div key={member._id} className="p-2 d-flex align-items-center justify-content-between">
                                                <div className="text-light d-grid">
                                                    <img 
                                                        src={`${baseUrl}/${member.image}`} 
                                                        alt="" 
                                                        className="rounded-circle mx-auto" 
                                                    />
                                                    <span className="text-center">{member.name}</span>
                                                </div>
                                            </div>
                                        ))}   
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <h2 className="text-light">Tasks:</h2>
                                    <div className="Tasks rounded-3 p-2 overflow-y-auto">
                                        {projectTask.length === 0 ? 
                                            (
                                                <strong className="text-light">No Task added</strong>
                                            )
                                            :
                                            (
                                                projectTask.map(task => (
                                                    <div key={task._id} className="text-start">
                                                        <div className="mb-1">
                                                            {task.status === "Pending" && <MdPending style={{ color: '#FF6347', fontSize: '30px' }}/>}
                                                            {task.status === "In Progress" && <MdPlayArrow style={{ color: '#0D6EFD', fontSize: '30px' }}/>}
                                                            {task.status === "Completed" && <MdDone style={{ color: '#32CD32', fontSize: '30px' }}/>}
                                                            <span className="text-light">{" " + task.title}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="DateProject d-flex flex-wrap justify-content-around">

                                <div className="startDate p-2 rounded-3">
                                    <p className="fw-semibold">Start Date</p>

                                    <p><FaHourglassStart /> {startDate}</p>
                                </div>
                                <div className="endDate p-2 rounded-3">
                                    <p className="fw-semibold">End Date</p>

                                    <p><FaHourglassEnd /> {endDate}</p>
                                </div>
                            </div>
                        </div>
        
                    </div>

                    <div className="col-md-3">
                        <div className="pt-4 MyTask">
                            <h1 className="mb-3">My Task</h1>
                            <div className="mt-3 MyTaskList rounded-3 mt-3 mx-3 p-4 overflow-y-auto">
                                <div className="rounded-3 sticky-top d-flex align-items-center justify-content-between input-container">
                                    <input 
                                            type="text" 
                                            name="search_user" 
                                            className="search-input rounded-3"
                                            placeholder="Search Task"
                                            value={taskSearchTerm}
                                            onChange={(e) => setTaskSearchTerm(e.target.value)}
                                            onKeyDown={HandleSearchTask}
                                    />
                                    <button className="search-button">
                                        <FaSearch className="icon"/>
                                    </button>
                                </div>
                                <div className="mt-3 list-group">
                                    {taskSearchTerm?(
                                        taskSearchResults.length === 0 ? 
                                        (
                                                <strong className="text-light">No task found</strong>
                                        )
                                        :
                                        (
                                            showTaskSearchResult ? (
                                                taskSearchResults.map(task => (
                                                    <div key={task._id} className="text-light">
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
                                            (taskSearchResults.map(task => (
                                                <div>
                                                    <div key={task._id}>
                                                        <div className="list-group-item list-group-item-action user-list-item rounded-3">                                            
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <div className="mb-1">
                                                                    {task.status === "Pending" && <MdPending style={{ color: '#FF6347', fontSize: '30px' }}/>}
                                                                    {task.status === "In Progress" && <MdPlayArrow style={{ color: '#0D6EFD', fontSize: '30px' }}/>}
                                                                    {task.status === "Completed" && <MdDone style={{ color: '#32CD32', fontSize: '30px' }}/>}
                                                                    {" " + task.title}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                            )
                                            )
                                            )
                                        )
                                    )
                                    :
                                    (
                                        MyTasks.map(task => (
                                            <div>
                                                <div key={task._id}>
                                                    <div className="list-group-item list-group-item-action user-list-item rounded-3">                                            
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div className="mb-1">
                                                                {task.status === "Pending" && <MdPending style={{ color: '#FF6347', fontSize: '30px'}}/>}
                                                                {task.status === "In Progress" && <MdPlayArrow style={{ color: '#0D6EFD', fontSize: '30px' }}/>}
                                                                {task.status === "Completed" && <MdDone style={{ color: '#32CD32', fontSize: '30px' }}/>}
                                                                {" " + task.title}
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

                        <div className="pt-4">
                            <div className="Stat">
                                <h1 className="mb-3"><FcStatistics /> Statistics</h1>
                                <div className="mt-3 Statistics rounded-3 mt-3 mx-3 p-4">
                                    <div className="GlobalStat text-start p-4 overflow-y-auto text-light">
                                        <p><span><GoProject style={{ color: '#32CD32', fontSize: '30px' }}/> Projects: </span> <span style={{ color: '#32CD32', fontSize: '20px' }}>{projectCount.projectCount}</span></p>
                                        <p><span><FaUsers style={{ color: '#FFFF00', fontSize: '30px' }}/> Personnel: </span> <span style={{ color: '#FFFF00', fontSize: '20px' }}>{userCount.userCount}</span></p>
                                        <p><span><GoTasklist style={{ color: '#FF00FF', fontSize: '30px' }}/> Tasks: </span> <span style={{ color: '#FF00FF', fontSize: '20px' }}>{taskStats.totalTasks}</span></p>
                                        <p><span><MdPending style={{ color: '#FF6347', fontSize: '30px' }}/> Pending: </span> <span style={{ color: '#FF6347', fontSize: '20px' }}>{taskStats.pendingTasks}</span></p>
                                        <p><span><MdPlayArrow style={{ color: 'blue', fontSize: '30px' }}/> In Progress: </span> <span style={{ color: 'blue', fontSize: '20px' }}>{taskStats.inProgerssTasks}</span></p>
                                        <p><span><MdDone style={{ color: '#32CD32', fontSize: '30px' }}/> Completed: </span> <span style={{ color: '#32CD32', fontSize: '20px' }}>{taskStats.completedTasks}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;