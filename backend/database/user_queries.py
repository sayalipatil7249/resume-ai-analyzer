from database.connection import user_collection
from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)


# CREATE USER
def create_user(data):

    existing_user = user_collection.find_one({

        "email": data["email"]

    })

    if existing_user:

        return None

    data["password"] = generate_password_hash(

        data["password"]

    )

    result = user_collection.insert_one(data)

    return result


# LOGIN USER
def login_user(email, password):

    user = user_collection.find_one({

        "email": email

    })

    if not user:

        return None

    valid = check_password_hash(

        user["password"],
        password
    )

    if not valid:

        return None

    user["_id"] = str(user["_id"])

    user.pop("password")

    return user


# GET USER
def get_user():

    user = user_collection.find_one()

    if user:

        user["_id"] = str(user["_id"])

    return user


# UPDATE USER
def update_user(data):

    user = user_collection.find_one()

    if not user:

        return None

    user_collection.update_one(

        {"_id": user["_id"]},

        {
            "$set": {

                "name": data.name,
                "username": data.username,
                "email": data.email

            }
        }
    )

    return True


# UPDATE PASSWORD
def update_password(current_password, new_password):

    user = user_collection.find_one()

    if not user:

        return False

    valid = check_password_hash(

        user["password"],
        current_password

    )

    if not valid:

        return False

    hashed_password = generate_password_hash(

        new_password

    )

    user_collection.update_one(

        {"_id": user["_id"]},

        {
            "$set": {

                "password": hashed_password

            }
        }
    )

    return True