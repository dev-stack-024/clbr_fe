import axios from 'axios';

export const loginUser = (email, password) => async dispatch => {
  try {
    const response = await axios.post('/api/users/login', { email, password });
    const { token } = response.data;
    localStorage.setItem('authToken', token);
    dispatch({ type: 'LOGIN_SUCCESS', payload: token });
  } catch (error) {
    console.error('Login failed', error);
    dispatch({ type: 'LOGIN_FAILURE' });
  }
};

export const registerUser = userData => async dispatch => {
  try {
    const response = await axios.post('/api/users/register', userData);
    dispatch({ type: 'REGISTER_SUCCESS', payload: response.data });
  } catch (error) {
    console.error('Registration failed', error);
    dispatch({ type: 'REGISTER_FAILURE' });
  }
};
