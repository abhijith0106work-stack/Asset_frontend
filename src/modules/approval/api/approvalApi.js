import axios from 'axios';
import { API_BASE_URL } from '../../../config';

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const approvalApi = {
  // Departments
  getDepartments: () => axios.get(`${API_BASE_URL}/departments`, getHeaders()),
  createDepartment: (data) => axios.post(`${API_BASE_URL}/departments`, data, getHeaders()),
  updateDepartment: (id, data) => axios.put(`${API_BASE_URL}/departments/${id}`, data, getHeaders()),
  deleteDepartment: (id) => axios.delete(`${API_BASE_URL}/departments/${id}`, getHeaders()),
  
  // Workflows
  getWorkflow: (deptId) => axios.get(`${API_BASE_URL}/approval/workflows/${deptId}`, getHeaders()),
  saveWorkflow: (data) => axios.post(`${API_BASE_URL}/approval/workflows`, data, getHeaders()),
  
  // Files
  getFiles: () => axios.get(`${API_BASE_URL}/approval/files`, getHeaders()),
  submitFile: (data) => axios.post(`${API_BASE_URL}/approval/files`, data, getHeaders()),
  updateFile: (id, data) => axios.put(`${API_BASE_URL}/approval/files/${id}`, data, getHeaders()),
  deleteFile: (id) => axios.delete(`${API_BASE_URL}/approval/files/${id}`, getHeaders()),
  resubmitFile: (id, comment) => axios.post(`${API_BASE_URL}/approval/files/${id}/resubmit`, { comment }, getHeaders()),
  addComment: (id, text) => axios.post(`${API_BASE_URL}/approval/files/${id}/comments`, { text }, getHeaders()),
  getFileDetail: (id) => axios.get(`${API_BASE_URL}/approval/files/${id}`, getHeaders()),
  
  // Movements
  approveFile: (data) => axios.post(`${API_BASE_URL}/approval/movements/approve`, data, getHeaders()),
  rejectFile: (data) => axios.post(`${API_BASE_URL}/approval/movements/reject`, data, getHeaders()),
  getFileHistory: (fileId) => axios.get(`${API_BASE_URL}/approval/movements/${fileId}`, getHeaders()),
  
  // Notifications
  getNotifications: () => axios.get(`${API_BASE_URL}/approval/notifications`, getHeaders()),

  // Users for Assignment
  getUsersByDepartment: (deptId) => axios.get(`${API_BASE_URL}/users?department=${deptId}`, getHeaders()),
  getAllUsers: () => axios.get(`${API_BASE_URL}/users`, getHeaders()),
};
