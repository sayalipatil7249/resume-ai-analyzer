from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# MongoDB URL
MONGO_URL = os.getenv("MONGO_URL")

# Database Name
DATABASE_NAME = os.getenv("DATABASE_NAME")

# MongoDB Client
client = MongoClient(MONGO_URL)

# Database
db = client[DATABASE_NAME]

# Collections
resume_collection = db["resumes"]

user_collection = db["users"]

search_collection = db["search_history"]

print("MongoDB Connected Successfully")

from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")

db = client["resume_ai_db"]

resume_collection = db["resumes"]

user_collection = db["users"]