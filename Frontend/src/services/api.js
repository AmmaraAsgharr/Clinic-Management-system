const API_BASE_URL = '/api';

/**
 * Base fetch wrapper with JWT Authorization header support and error parsing
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('clinic_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API error at ${endpoint}:`, error.message);
    throw error;
  }
}

// Authentication Service
export const authService = {
  login: async (credentials) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      localStorage.setItem('clinic_token', data.token);
    }
    if (data.doctor) {
      localStorage.setItem('clinic_doctor', JSON.stringify(data.doctor));
    }
    return data;
  },

  register: async (doctorData) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(doctorData),
    });
    if (data.token) {
      localStorage.setItem('clinic_token', data.token);
    }
    if (data.doctor) {
      localStorage.setItem('clinic_doctor', JSON.stringify(data.doctor));
    }
    return data;
  },

  getMe: () => apiRequest('/auth/me'),

  logout: () => {
    localStorage.removeItem('clinic_token');
    localStorage.removeItem('clinic_doctor');
  },
};

// Patient Service
export const patientService = {
  getPatients: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.status && params.status !== 'All') query.set('status', params.status);
    const queryString = query.toString();
    return apiRequest(`/patients${queryString ? `?${queryString}` : ''}`);
  },

  getStats: () => apiRequest('/patients/stats'),

  getPatientById: (patientId) => apiRequest(`/patients/${patientId}`),

  createPatient: (patientData) =>
    apiRequest('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    }),

  updatePatient: (patientId, patientData) =>
    apiRequest(`/patients/${patientId}`, {
      method: 'PUT',
      body: JSON.stringify(patientData),
    }),
};

// Visit Service
export const visitService = {
  createVisit: (visitData) =>
    apiRequest('/visits', {
      method: 'POST',
      body: JSON.stringify(visitData),
    }),

  getPatientVisits: (patientId) => apiRequest(`/visits/patient/${patientId}`),
};

// Medical File Service
export const fileService = {
  getPatientFiles: (patientId) => apiRequest(`/files/patient/${patientId}`),

  uploadFile: async (formData) => {
    const token = localStorage.getItem('clinic_token');
    const headers = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/files/upload`, {
        method: 'POST',
        headers,
        body: formData, // browser automatically sets multipart/form-data with boundary
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `Upload failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API error at /files/upload:', error.message);
      throw error;
    }
  },

  createFileRecord: (fileData) =>
    apiRequest('/files', {
      method: 'POST',
      body: JSON.stringify(fileData),
    }),

  getPresignedUrl: (fileId) => apiRequest(`/files/${fileId}/presigned-url`),

  // Direct GridFS view URL (no extra API call needed)
  getViewUrl: (fileId) => `/api/files/${fileId}/view`,

  deleteFile: (fileId) =>
    apiRequest(`/files/${fileId}`, {
      method: 'DELETE',
    }),
};


