import axios from "axios";

const API_URL = "http://localhost:9000"; //  backend URL

// USERS
export const registerUser = (data) => {
  const token = localStorage.getItem("token");
  return axios.post(`${API_URL}/signup`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUser = (id, data) => {
  const token = localStorage.getItem("token");
  return axios.put(`${API_URL}/api/users/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteUser = (id) => {
  const token = localStorage.getItem("token");
  return axios.delete(`${API_URL}/api/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
