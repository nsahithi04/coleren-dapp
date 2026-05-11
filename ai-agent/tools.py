from langchain.tools import tool
from db import db
from bson import ObjectId
import json

def serialize(obj):
    """Convert MongoDB docs to JSON-safe format"""
    if isinstance(obj, list):
        return [serialize(i) for i in obj]
    if isinstance(obj, dict):
        return {k: serialize(v) for k, v in obj.items() if k != "_id"}
    if isinstance(obj, ObjectId):
        return str(obj)
    return obj

@tool
def get_collections() -> str:
    """Get all available collection names in the database."""
    return str(db.list_collection_names())

@tool
def query_database(
    collection: str,
    query: dict = {},
    projection: dict = {},
    sort_by: str = "",
    sort_order: int = -1,
    limit: int = 20
) -> str:
    """
    Query MongoDB flexibly.

    Args:
        collection: Collection name to query
        query: MongoDB filter (e.g. {"status": "active"})
        projection: Fields to return (e.g. {"name": 1, "email": 1})
        sort_by: Field name to sort by (e.g. "createdAt")
        sort_order: 1 for ascending, -1 for descending (default: -1)
        limit: Max number of results (default: 20)
    """
    try:
        collections = db.list_collection_names()
        if collection not in collections:
            return f"Collection '{collection}' not found. Available: {collections}"

        proj = {k: v for k, v in projection.items()}
        proj["_id"] = 0  

        cursor = db[collection].find(query, proj)

        if sort_by:
            cursor = cursor.sort(sort_by, sort_order)

        cursor = cursor.limit(limit)
        results = serialize(list(cursor))

        if not results:
            return "No results found for your query."

        return json.dumps(results, indent=2, default=str)

    except Exception as e:
        return f"Query error: {str(e)}"