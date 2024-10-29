from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import jwt
import uuid
import json
from pathlib import Path

app = FastAPI(title="DocuMind AI API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Secret key for JWT
SECRET_KEY = "your-secret-key"  # In production, use proper secret management
ALGORITHM = "HS256"

# Simple in-memory storage (replace with proper database in production)
users_db = {}
documents_db = {}
chat_history = {}

class User(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class Document(BaseModel):
    id: str
    name: str
    content: str
    user_id: str
    created_at: datetime

class Message(BaseModel):
    content: str
    role: str
    timestamp: datetime

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401)
        return user_id
    except jwt.JWTError:
        raise HTTPException(status_code=401)

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_db.get(form_data.username)
    if not user or user["password"] != form_data.password:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token({"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users")
async def create_user(user: User):
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    users_db[user.email] = {"email": user.email, "password": user.password}
    return {"message": "User created successfully"}

@app.post("/documents")
async def upload_document(
    file: UploadFile = File(...),
    current_user: str = Depends(get_current_user)
):
    content = await file.read()
    doc_id = str(uuid.uuid4())
    documents_db[doc_id] = {
        "id": doc_id,
        "name": file.filename,
        "content": content.decode(),
        "user_id": current_user,
        "created_at": datetime.now()
    }
    return {"id": doc_id, "name": file.filename}

@app.get("/documents")
async def get_documents(current_user: str = Depends(get_current_user)):
    user_docs = [
        doc for doc in documents_db.values()
        if doc["user_id"] == current_user
    ]
    return user_docs

@app.delete("/documents/{doc_id}")
async def delete_document(
    doc_id: str,
    current_user: str = Depends(get_current_user)
):
    if doc_id not in documents_db:
        raise HTTPException(status_code=404, detail="Document not found")
    
    doc = documents_db[doc_id]
    if doc["user_id"] != current_user:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    del documents_db[doc_id]
    return {"message": "Document deleted"}

@app.post("/chat/{doc_id}")
async def chat_with_document(
    doc_id: str,
    message: str,
    current_user: str = Depends(get_current_user)
):
    if doc_id not in documents_db:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Simulate RAG response
    response = f"Based on the document content, here's what I found about: {message}"
    
    # Store chat history
    if doc_id not in chat_history:
        chat_history[doc_id] = []
    
    chat_history[doc_id].extend([
        {
            "content": message,
            "role": "user",
            "timestamp": datetime.now()
        },
        {
            "content": response,
            "role": "assistant",
            "timestamp": datetime.now()
        }
    ])
    
    return {"response": response}

@app.get("/chat/{doc_id}")
async def get_chat_history(
    doc_id: str,
    current_user: str = Depends(get_current_user)
):
    if doc_id not in documents_db:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return chat_history.get(doc_id, [])