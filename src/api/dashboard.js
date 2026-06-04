// src/api/dashboard.js
import axios from 'axios';
import { API_BASE_URL } from '../config';

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const fetchKPIs = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/dashboard/kpis`, {
    headers: authHeaders(),
  });
  return data; // { assets, tickets, users, vehicles }
};

export const fetchPending = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/dashboard/pending`, {
    headers: authHeaders(),
  });
  return data;
};

export const fetchDepartments = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/dashboard/departments`, {
    headers: authHeaders(),
  });
  return data;
};

export const fetchHealth = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/dashboard/health`, {
    headers: authHeaders(),
  });
  return data;
};
