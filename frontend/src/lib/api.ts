import { User, Resume, Review, JobMatchResults } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// In-memory token storage
let accessToken: string | null = null;
let userListeners: ((user: User | null) => void)[] = [];
let currentUser: User | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const setCurrentUser = (user: User | null) => {
  currentUser = user;
  userListeners.forEach((listener) => listener(user));
};

export const subscribeToUser = (listener: (user: User | null) => void) => {
  userListeners.push(listener);
  // Initial callback
  listener(currentUser);
  return () => {
    userListeners = userListeners.filter((l) => l !== listener);
  };
};

/**
 * Custom fetch wrapper that automatically handles Bearer token & refresh tokens
 */
const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Set headers
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  // Include credentials (cookies) for refresh token endpoint
  options.credentials = 'include';
  options.headers = headers;

  let response = await fetch(url, options);

  // If unauthorized, try to refresh access token
  if (response.status === 401 && endpoint !== '/auth/refresh' && endpoint !== '/auth/login') {
    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        accessToken = refreshData.accessToken;
        setCurrentUser(refreshData.user);

        // Retry the original request
        headers.set('Authorization', `Bearer ${accessToken}`);
        options.headers = headers;
        response = await fetch(url, options);
      } else {
        // Refresh token invalid, clear session
        accessToken = null;
        setCurrentUser(null);
      }
    } catch (err) {
      accessToken = null;
      setCurrentUser(null);
    }
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

// API Services
export const authApi = {
  register: (body: any) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  verifyEmail: (body: any) => apiRequest('/auth/verify-email', { method: 'POST', body: JSON.stringify(body) }),
  login: async (body: any) => {
    const data = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(body) });
    if (data.success) {
      accessToken = data.accessToken;
      setCurrentUser(data.user);
    }
    return data;
  },
  logout: async () => {
    const data = await apiRequest('/auth/logout', { method: 'POST' });
    accessToken = null;
    setCurrentUser(null);
    return data;
  },
  refresh: async () => {
    const data = await apiRequest('/auth/refresh', { method: 'POST' });
    if (data.success) {
      accessToken = data.accessToken;
      setCurrentUser(data.user);
    }
    return data;
  },
  forgotPassword: (body: any) => apiRequest('/auth/forgot-password', { method: 'POST', body: JSON.stringify(body) }),
  resetPassword: (body: any) => apiRequest('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),
  googleLogin: async (token: string) => {
    const data = await apiRequest('/auth/google', { method: 'POST', body: JSON.stringify({ token }) });
    if (data.success) {
      accessToken = data.accessToken;
      setCurrentUser(data.user);
    }
    return data;
  },
  githubLogin: async (token: string) => {
    const data = await apiRequest('/auth/github', { method: 'POST', body: JSON.stringify({ token }) });
    if (data.success) {
      accessToken = data.accessToken;
      setCurrentUser(data.user);
    }
    return data;
  },
};

export const resumeApi = {
  getAll: (): Promise<{ success: boolean; resumes: any[] }> => apiRequest('/resumes'),
  getById: (id: string): Promise<{ success: boolean; resume: Resume }> => apiRequest(`/resumes/${id}`),
  create: (body: { title: string; templateId?: string }): Promise<{ success: boolean; resume: Resume }> =>
    apiRequest('/resumes', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Partial<Resume>): Promise<{ success: boolean; resume: Resume }> =>
    apiRequest(`/resumes/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id: string): Promise<{ success: boolean; message: string }> =>
    apiRequest(`/resumes/${id}`, { method: 'DELETE' }),
  duplicate: (id: string): Promise<{ success: boolean; resume: Resume }> =>
    apiRequest(`/resumes/${id}/duplicate`, { method: 'POST' }),
  import: (formData: FormData): Promise<{ success: boolean; message: string; resume: Resume }> =>
    apiRequest('/resumes/import', { method: 'POST', body: formData }),
};

export const aiApi = {
  review: (resumeId: string): Promise<{ success: boolean; review: Review }> =>
    apiRequest('/ai/review', { method: 'POST', body: JSON.stringify({ resumeId }) }),
  matchJob: (resumeId: string, jobDescription: string): Promise<{ success: boolean; matchResults: JobMatchResults }> =>
    apiRequest('/ai/job-match', { method: 'POST', body: JSON.stringify({ resumeId, jobDescription }) }),
  generate: (prompt: string): Promise<{ success: boolean; resumeData: any }> =>
    apiRequest('/ai/generate', { method: 'POST', body: JSON.stringify({ prompt }) }),
  improveBullets: (bullets: string[], jobTitle?: string): Promise<{ success: boolean; improvedBullets: string[] }> =>
    apiRequest('/ai/improve-bullets', { method: 'POST', body: JSON.stringify({ bullets, jobTitle }) }),
  getReviews: (resumeId: string): Promise<{ success: boolean; reviews: Review[] }> =>
    apiRequest(`/ai/reviews/${resumeId}`),
};
