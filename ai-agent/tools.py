from langchain.tools import tool
from pathlib import Path
from db import db, ALLOWED_COLLECTIONS, SENSITIVE_FIELDS
from datetime import datetime, timezone

KNOWLEDGE_PATH = (
    Path(__file__).parent
    / "knowledge"
    / "knowledge_base.txt"
)

@tool
def read_knowledge_base():
    """
    Reads the Coleren knowledge base.

    Use this tool whenever users ask about:
    - Coleren platform
    - pricing
    - onboarding
    - integrations
    - CRM workflows
    - analytics
    - sales features
    - support
    - company/product information

    Always use this tool before answering
    platform-related questions.
    """
    with open(KNOWLEDGE_PATH, "r") as f:
        return f.read()


@tool
def get_schema():
    """
    Returns the available collections and their fields
    in the Coleren database. Always call this before
    querying a collection, to know what fields exist.
    """
    schema = {}
    for name in ALLOWED_COLLECTIONS:
        sample = db[name].find_one()
        if not sample:
            schema[name] = []
            continue
        fields = [
            f for f in sample.keys()
            if f not in SENSITIVE_FIELDS and f != "_id"
        ]
        schema[name] = fields
    return schema


@tool
def query_collection(collection_name: str, filter_json: dict = None, limit: int = 20):
    """
    Queries a Coleren MongoDB collection for records.

    Args:
        collection_name: One of Survey, Product, Meeting, Lead, Feedback.
        filter_json: A MongoDB-style filter dict, e.g. {"status": "NEW"}.
                     Leave empty to fetch general/recent records.
        limit: Max number of records to return (default 20, max 50).

    Only collections in the allowed list can be queried.
    """
    if collection_name not in ALLOWED_COLLECTIONS:
        return {"error": f"Access to '{collection_name}' is not permitted."}

    limit = min(limit, 50)
    cursor = db[collection_name].find(filter_json or {}).limit(limit)

    results = []
    for doc in cursor:
        doc.pop("_id", None)
        for field in list(doc.keys()):
            if field in SENSITIVE_FIELDS:
                doc.pop(field, None)
        results.append(doc)

    return results


@tool
def get_current_datetime():
    """
    Returns the current date and time in UTC ISO format.
    Use this whenever a question involves relative dates like
    "today", "this week", "yesterday", "last month", etc.,
    before querying any collection with a date filter.
    """
    return datetime.now(timezone.utc).isoformat()