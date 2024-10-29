# DocuMind AI

A document management system with RAG capabilities.

## Setup

1. Install frontend dependencies:
```bash
npm install
```

2. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Start the backend server:
```bash
python3 main.py
```

4. Start the frontend development server:
```bash
npm run dev
```

## Features

- Document upload and management
- Chat interface with RAG capabilities
- User authentication
- Real-time document processing
- Secure API endpoints

## API Endpoints

- `POST /token` - User authentication
- `POST /users` - User registration
- `POST /documents` - Upload document
- `GET /documents` - List documents
- `DELETE /documents/{id}` - Delete document
- `POST /chat/{doc_id}` - Send message
- `GET /chat/{doc_id}` - Get chat history

## Security

- JWT-based authentication
- Protected API endpoints
- CORS enabled for development

## Production Deployment

For production:

1. Use proper secret management
2. Replace in-memory storage with a database
3. Add proper error handling
4. Implement rate limiting
5. Set up proper CORS configuration
6. Add logging and monitoring