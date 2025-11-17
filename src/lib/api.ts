const API_BASE = '/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    apiRequest<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  signup: (data: {
    name: string;
    email: string;
    password: string;
    userType: string;
    phone?: string;
  }) =>
    apiRequest<{ token: string; user: any }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Patient API
export const patientAPI = {
  getPatient: (id: string | number) =>
    apiRequest<any>(`/patients/${id}`),

  addTask: (patientId: string | number, task: { title: string; time: string; category: string }) =>
    apiRequest<any>(`/patients/${patientId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(task),
    }),

  updateTask: (patientId: string | number, taskId: string | number, data: { completed?: boolean; title?: string; time?: string; category?: string }) =>
    apiRequest<any>(`/patients/${patientId}/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteTask: (patientId: string | number, taskId: string | number) =>
    apiRequest<any>(`/patients/${patientId}/tasks/${taskId}`, {
      method: 'DELETE',
    }),

  getMedications: (patientId: string | number) =>
    apiRequest<any>(`/patients/${patientId}/medications`),

  markMedicationTaken: (patientId: string | number, medicationId: number, medicationName: string) =>
    apiRequest<any>(`/patients/${patientId}/medications`, {
      method: 'POST',
      body: JSON.stringify({ medicationId, medicationName }),
    }),

  addMedication: (patientId: string | number, medication: { name: string; frequency: string }) =>
    apiRequest<any>(`/patients/${patientId}/medications`, {
      method: 'PUT',
      body: JSON.stringify(medication),
    }),

  uploadWoundPhoto: async (patientId: string | number, photo: File) => {
    const formData = new FormData();
    formData.append('photo', photo);
    const token = getAuthToken();
    const headers: HeadersInit = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // Don't set Content-Type - browser will set it with boundary for FormData

    const response = await fetch(`${API_BASE}/patients/${patientId}/photos`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};

// Family API
export const familyAPI = {
  getFamilyTasks: (patientId: string | number) =>
    apiRequest<any>(`/family/${patientId}/tasks`),

  addFamilyTask: (patientId: string | number, task: { assignee: string; task: string; time: string }) =>
    apiRequest<any>(`/family/${patientId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(task),
    }),

  updateFamilyTask: (patientId: string | number, taskId: string | number, data: { status?: string; task?: string; assignee?: string; time?: string }) =>
    apiRequest<any>(`/family/${patientId}/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteFamilyTask: (patientId: string | number, taskId: string | number) =>
    apiRequest<any>(`/family/${patientId}/tasks/${taskId}`, {
      method: 'DELETE',
    }),
};

// Video API
export const videoAPI = {
  getVideos: (search?: string, category?: string) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    const query = params.toString();
    return apiRequest<{ videos: any[] }>(`/videos${query ? `?${query}` : ''}`);
  },

  getVideo: (id: string | number) =>
    apiRequest<any>(`/videos/${id}`),
};

// Directory API
export const directoryAPI = {
  getDirectory: (search?: string) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    const query = params.toString();
    return apiRequest<{ hospitals: any[]; specialists: any[] }>(`/directory${query ? `?${query}` : ''}`);
  },
};

// Community API
export const communityAPI = {
  getTips: (videoId?: string | number) => {
    const params = new URLSearchParams();
    if (videoId) params.append('videoId', String(videoId));
    const query = params.toString();
    return apiRequest<{ tips: any[] }>(`/community/tips${query ? `?${query}` : ''}`);
  },

  addTip: (tip: { videoId?: number; videoTitle?: string; content: string }) =>
    apiRequest<any>('/community/tips', {
      method: 'POST',
      body: JSON.stringify(tip),
    }),

  upvoteTip: (tipId: number) =>
    apiRequest<any>(`/community/tips/upvote/${tipId}`, {
      method: 'POST',
    }),
};

// Hospital API
export const hospitalAPI = {
  getHospitals: (search?: string) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    const query = params.toString();
    return apiRequest<{ hospitals: any[] }>(`/hospitals${query ? `?${query}` : ''}`);
  },

  contactHospital: (data: { hospitalId: number; hospitalName: string; subject: string; message: string }) =>
    apiRequest<any>('/hospitals/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

