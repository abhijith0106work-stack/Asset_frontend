import { API_BASE_URL } from './config';
/**
 * Centralized API Configuration
 * Change the API_BASE_URL here to update it across the entire application.
 */

// For Production (Ubuntu/Nginx/AWS with proxy): Use '/api'
// For Local Development: Use `${API_BASE_URL}`
export const API_BASE_URL = '/api'; 

export default API_BASE_URL;
