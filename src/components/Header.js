import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Image } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import defaultAvatar from '../assets/defaultAvatar.jpg';

const Header = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

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

  const navLinkStyle = (path) => ({
    color: '#ffffff',
    margin: '0 10px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    padding: '5px 10px',
    borderRadius: '4px',
    backgroundColor: location.pathname === path ? '#3d4350' : 'transparent',
    transition: 'background-color 0.3s ease',
  });

  const logoutButtonStyle = {
    marginLeft: 'auto',
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
        {/* <Navbar.Brand style={brandStyle} href="/">Local Reviews</Navbar.Brand> */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <div>
              <Link to="/" style={navLinkStyle('/')}><b>Home</b></Link>
              <Link to="/map" style={navLinkStyle('/map')}><b>Maps</b></Link>
              {user?.user.role === "businessOwner" &&
                <Link to="/add-location" style={navLinkStyle('/add-location')}><b>Add Business</b></Link>
              }
              {user?.user.role === "businessOwner" &&
                <Link to={`/my-location/${user.user._id}`} style={navLinkStyle(`/my-location/${user.user._id}`)}><b>My Business</b></Link>
              }
            </div>
            {!isAuthenticated ? (
              <>
                <Link to="/login" style={navLinkStyle('/login')}>Login</Link>
                <Link to="/register" style={navLinkStyle('/register')}>Register</Link>
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
                <span
                  onClick={handleProfileClick}
                  style={{
                    color: '#ffffff',
                    fontSize: '1.1rem',
                    marginRight: '15px',
                    cursor: "pointer",
                    backgroundColor: location.pathname === '/profile' ? '#3d4350' : 'transparent',
                    padding: '5px 10px',
                    borderRadius: '4px'
                  }}
                >
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