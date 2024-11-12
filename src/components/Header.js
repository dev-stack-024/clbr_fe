import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Image } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext'; // Ensure correct path
import defaultAvatar from '../assets/defaultAvatar.jpg'; // Path to default avatar image

const Header = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  const handleProfileClick = () => {
    navigate('/profile');
  };
  // Inline styles for a more visually appealing header
  const headerStyle = {
    backgroundColor: '#282c34',
    padding: '10px 20px',
    borderBottom: '2px solid #61dafb',
  };

  const brandStyle = {
    color: '#61dafb',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    textDecoration: 'none',
  };

  const navLinkStyle = {
    color: '#ffffff',
    margin: '0 10px',
    textDecoration: 'none',
    fontSize: '1.1rem',
  };

  const logoutButtonStyle = {
    marginLeft: 'auto', // Push the button to the right
    display: 'flex',
    alignItems: 'center',
  };

  const avatarStyle = {
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    marginRight: '10px',
    cursor: "pointer"
  };

  return (
    <Navbar style={headerStyle} expand="lg">
      <Container>
        <Navbar.Brand style={brandStyle} href="/">Local Reviews</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <div>
              <Link to="/" style={navLinkStyle}><b>Home</b></Link>
              {user?.user.role === "businessOwner" && <Link to="/add-location" style={navLinkStyle}><b>Add Business</b></Link>}
              {user?.user.role === "businessOwner" && <Link to={`/my-location/${user.user._id}`} style={navLinkStyle}><b>My Business</b></Link>}
            </div>
            {!isAuthenticated ? (
              <>
                <Link to="/login" style={navLinkStyle}>Login</Link>
                <Link to="/register" style={navLinkStyle}>Register</Link>
              </>
            ) : (
              <div style={logoutButtonStyle}>
                <Image
                  src={user?.user?.profilePictureURL || defaultAvatar}
                  alt="User Avatar"
                  style={avatarStyle}
                  roundedCircle
                  onClick={handleProfileClick}
                />
                <span onClick={handleProfileClick} style={{ color: '#ffffff', fontSize: '1.1rem', marginRight: '15px', cursor: "pointer" }}>
                  {user.user.name}
                </span>
                <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
