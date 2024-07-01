import React,  { useEffect, useState}  from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaSearch } from "react-icons/fa";

// import assets
import '../../assets/css/Account.css';

// import service
import fetchUserData from "../../services/homeService";
import { updateUserProfile } from '../../services/accountService';
import { searchPersonnel } from '../../services/accountService';
import { deletePersonnel } from "../../services/accountService";

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

    // For searching user
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
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

                // state initiate with the user data achieved
                setUserData(data);
                setName(data.name);
                setEmail(data.email);
                setMobileNumber(data.mobileNumber);

                const allUsers = await searchPersonnel(token, '');
                setAllUsers(allUsers);
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

    
    const imageUrl = `${baseUrl}/${userData.image}`;

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const updateProfile = async (e) => {
        setSuccessMessage('');
        setErrorMessage('');
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
                await updateUserProfile(token, formData);
                setSuccessMessage('Update successful');
                setTimeout(() => {
                    navigate('/account');
                }, 1000);
            } catch (error) {
                setErrorMessage(error.response?.data?.message || 'Authentication failed');
                setSuccessMessage('');
            }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setTimeout(() => {
            navigate('/login');
        }, 2000);
    };

    const searchUser =  async (event) => {

        if(event.key === 'Enter' || event.type === 'click')
        {
            event.preventDefault();
            const token = localStorage.getItem('token');
            try {
                const results = await searchPersonnel(token,searchTerm);
                setSearchResults(results);
                if(searchTerm){
                    setShowSearchResult(false);
                }
                else{
                    setShowSearchResult(true);
                }
            }
            catch(error) {
                console.error('Error searching users:', error);
            }

        }
        else{
            const token = localStorage.getItem('token');
            try {
                const results = await searchPersonnel(token,searchTerm);
                setSearchResults(results);
                setShowSearchResult(true);
            }
            catch(error) {
                console.error('Error searching users:', error);
            }
        }
        
    }

    const handleUserClick = (user) => {
        setSelectedUser(user);
    };

    const handleDeletePersonnel = async (userId) => {
        const token = localStorage.getItem('token');
        setSuccessMessage('');
        setErrorMessage();

        try {
            await deletePersonnel(token, userId);
            setSelectedUser(null);
            setSuccessMessage('User deleted successfully');


            setShowSearchResult(true);
            const updatedUsers = await searchPersonnel(token, '');
            setAllUsers(updatedUsers);
            setSearchTerm('')
            setSearchResults('');
            setSelectedUser(null);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to delete user');
            setSuccessMessage('');
        }
    };

    return (
        <div className="AccountPage">
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
                            </Nav>
                            <Nav>
                                <Nav.Link href="/account" className="text-dark">Account</Nav.Link>
                                <Nav.Link onClick={handleLogout} className="text-dark">Logout</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>

                    </Container>
                </Navbar>

                <div className="container-fluid d-flex justify-content-center align-items-center">

                    <div className="setting">
                        <h1 className="display-6 fw-bold mb-4 mt-2 text-center">Setting</h1>
                        {errorMessage && <p className="mt-3 text-danger errMess">{errorMessage}</p>}
                        {successMessage && <p className="mt-3 text-success succMess">{successMessage}</p>}
                        <div className={`formDiv ${errorMessage || successMessage ? 'shift' : ''}`}>
                            <form onSubmit={updateProfile} className="p-4 p-md-5 border rounded-3 bg-light">
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
                                            <input type="file" name="image" className="form-control" accept="image/x-png,image/gif,image/jpg,image/jpeg" onChange={handleImageChange}/>
                                            <label htmlFor="image">Image</label>
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
                    
                </div>

                <div className="personnel">
                    <h1 className="display-6 fw-bold mb-3 mt-2 text-center">Personnels</h1>
                    <div className="d-flex justify-content-center">
                        <div className="p-4 m-1 border rounded-3 bg-light userList">
                            <div className="sticky-top d-flex align-items-center justify-content-between input-container">
                                <input 
                                    type="text" 
                                    name="search_user" 
                                    className="search-input"
                                    placeholder="Search Personnel"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={searchUser}
                                />
                                <button className="search-button" onClick={searchUser}>
                                    <FaSearch className="icon"/>
                                </button>
                            </div>
                            <div className="mt-3 list-group">
                                {searchTerm ?(
                                    searchResults.length === 0 ? 
                                    (
                                        <strong className="text-gray-dark">No personnel found</strong>
                                    ) 
                                    :
                                    (
                                        showSearchResult ? (
                                            searchResults.map(user => (
                                                <div key={user._id} onClick={() => handleUserClick(user)}>
                                                    <div className="list-group-item list-group-item-action user-list-item rounded-3">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div className="mb-1">
                                                                <img 
                                                                    src={`${baseUrl}/${user.image}`} 
                                                                    alt="" 
                                                                    className="rounded-circle me-3" 
                                                                />
                                                                {user.name} - {user.email}
                                                            </div>
                                                        </div>
                                                        </div>
                                                </div>
                                            ))
                                        )
                                        :
                                        (
                                            <div className="list-group">
                                                {searchResults.map(user => (
                                                    <div key={user._id} onClick={() => handleUserClick(user)}>
                                                        <div className="list-group-item list-group-item-action user-list-item rounded-3">
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <div className="mb-1">
                                                                    <img
                                                                        src={`${baseUrl}/${user.image}`}
                                                                        alt=""
                                                                        className="rounded-circle me-3"
                                                                    />
                                                                    {user.name} - {user.email}
                                                                </div>

                                                                {userData.isAdmin && (
                                                                    <button 
                                                                        className="btn btn-danger"
                                                                        onClick={() => handleDeletePersonnel(user._id)}
                                                                    >Delete
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    )
                                    )
                                    :
                                    (
                                        <div className="text-center text-muted allUser">
                                        {allUsers.length === 0 ? (
                                            <strong className="text-gray-dark">No personnel found in database</strong>
                                        ) : (
                                                <div className="list-group">
                                                    {allUsers.map(user => (
                                                        <div key={user._id} onClick={() => handleUserClick(user)}>
                                                            <div className="list-group-item list-group-item-action user-list-item rounded-3">
                                                                <div className="d-flex align-items-center justify-content-between">
                                                                    <div className="mb-1">
                                                                        <img
                                                                            src={`${baseUrl}/${user.image}`}
                                                                            alt=""
                                                                            className="rounded-circle me-3"
                                                                        />
                                                                        {user.name} - {user.email}
                                                                    </div>

                                                                    {userData.isAdmin && (
                                                                        <button 
                                                                            className="btn btn-danger"
                                                                            onClick={() => handleDeletePersonnel(user._id)}
                                                                        >Delete
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>  
                                    )
                                }

                            </div>
                        </div>

                        <div className="p-4 m-1 border rounded-3 bg-light userInfo">
                            {
                                !selectedUser ? (
                                    <div className="text-center text-muted allUser"><strong className="text-gray-dark">Select a personnel to view details</strong></div>
                                )
                                :
                                (
                                    <div className="">
                                        <h2 className="fw-bold mb-3">{selectedUser.name}</h2>
                                        <p><strong>Email:</strong> {selectedUser.email}</p>
                                        <p><strong>Mobile Number:</strong> {selectedUser.mobileNumber}</p>
                                        <img src={`${baseUrl}/${selectedUser.image}`} alt={`${selectedUser.name}'s profile`} className="img-fluid img-thumbnail rounded-circle mb-3" />
                                        {userData.isAdmin && (
                                            <button className="btn btn-danger" onClick={() => (handleDeletePersonnel(selectedUser._id))}>Delete</button>
                                        )}
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>

            </div>
        </div>
                            
    )
}

export default Account;