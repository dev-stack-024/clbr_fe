import React, { useState, useEffect, useContext } from 'react';
import { Table, Pagination, Container, Modal } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import InfoWindowContent from '../../components/InfoWindow';

const Businesses = () => {
  const { user } = useContext(AuthContext);
  const [businesses, setBusinesses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const fetchBusinesses = async (page) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/business/get-all?page=${page}&limit=10`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setBusinesses(response.data.businesses);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses(currentPage);
  }, [currentPage, user.token]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowClick = (business) => {
    setSelectedBusiness(business);
    setShowModal(true);
  };


  return (
    <Container className="mt-4 p-4">
      <h2>Business Management</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className='mt-4'>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Description</th>
                <th>Average Rating</th>
                {/* <th>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {businesses.map((business) => (
                <tr key={business._id} onClick={() => handleRowClick(business)} style={{ cursor: 'pointer' }}>
                  <td>{business.name}</td>
                  <td>{business.address}</td>
                  <td>{business.description}</td>
                  <td>{business.averageRating?.toFixed(1) || 'No ratings'}</td>
                  {/* <td>
                    
                  </td> */}
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

          <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            size="lg"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Business Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedBusiness && (
                <InfoWindowContent
                  selectedBusiness={selectedBusiness}
                  fetchBusinesses={() => fetchBusinesses(currentPage)}
                />
              )}
            </Modal.Body>
          </Modal>
        </div>
      )}
    </Container>
  );
};

export default Businesses;
