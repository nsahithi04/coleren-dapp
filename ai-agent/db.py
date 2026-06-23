import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

client = MongoClient(os.getenv("AGENT_MONGO_URI"))
db = client["coleren_dapp"]

ALLOWED_COLLECTIONS = {"surveys", "products", "meetings", "leads", "feedbacks"} 

# userId references the User account model — never expose, regardless of collection.
# customerEmail is allowed: it's CRM customer contact info, not account credentials.
SENSITIVE_FIELDS = {"userId"}