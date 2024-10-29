const API_URL = 'http://localhost:8000';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Document {
  id: string;
  name: string;
  content: string;
  user_id: string;
  created_at: string;
}

export interface ChatMessage {
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

class Api {
  private token: string | null = null;

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async login(credentials: LoginCredentials) {
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const response = await fetch(`${API_URL}/token`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    this.token = data.access_token;
    return data;
  }

  async uploadDocument(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.fetch('/documents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });
  }

  async getDocuments(): Promise<Document[]> {
    return this.fetch('/documents');
  }

  async deleteDocument(docId: string) {
    return this.fetch(`/documents/${docId}`, {
      method: 'DELETE',
    });
  }

  async sendMessage(docId: string, message: string) {
    return this.fetch(`/chat/${docId}`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async getChatHistory(docId: string): Promise<ChatMessage[]> {
    return this.fetch(`/chat/${docId}`);
  }
}

export const api = new Api();