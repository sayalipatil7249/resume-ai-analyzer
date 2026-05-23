from database.connection import db

def initialize_database():

    collections = db.list_collection_names()

    print("Existing Collections:")

    for collection in collections:

        print(collection)

if __name__ == "__main__":

    initialize_database()