import React, { useState, useEffect, useContext } from 'react';
import { Table, Pagination, Container, Badge } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const Users = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async (page) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/get-all-users?page=${page}&limit=10`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, user.token]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/toggle-status/${userId}`,
        {}, // Empty request body
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      fetchUsers(currentPage);
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  return (
    <Container className="mt-4 p-4">
      <h2>User Management</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {/* <th>Phone</th> */}
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  {/* <td>{user.phone || 'N/A'}</td> */}
                  <td>
                    <Badge bg={user.role === 'admin' ? 'danger' : 'primary'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={user.isActive ? 'success' : 'danger'}>
                      {user.isActive ? 'Active' : 'Blocked'}
                    </Badge>
                  </td>
                  <td>
                    {/* Add action buttons here */}
                    <td>
                      <button
                        variant={user.isActive ? 'danger' : 'success'}
                        size="sm"
                        onClick={() => toggleUserStatus(user._id, user.isActive)}
                      >
                        {user.isActive ? 'Block' : 'Unblock'}
                      </button>
                    </td>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination>
            <Pagination.First
              disabled={currentPage === 1}
              onClick={() => handlePageChange(1)}
            />
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            />

            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}

            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            />
            <Pagination.Last
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(totalPages)}
            />
          </Pagination>
        </>
      )}
    </Container>
  );
};

export default Users;
