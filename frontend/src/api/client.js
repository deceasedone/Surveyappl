import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.data)
      throw new Error(error.response.data.message || 'An error occurred')
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request error:', error.request)
      throw new Error('No response received from server')
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message)
      throw new Error('Error setting up request')
    }
  }
)

export default api