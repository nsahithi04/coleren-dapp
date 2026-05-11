from db import db

def get_schema():
    schema = {}
    for col in db.list_collection_names():
        sample = db[col].find_one()
        if sample:
            schema[col] = list(sample.keys())
        else:
            schema[col] = []
    return schema