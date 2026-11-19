import getpass

import bcrypt

def hash_password(password):
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    hashed_password = hashed_password.decode("utf-8")
    return hashed_password

def verify_password(password, hashed_password):
    """
    Verify if the provided password matches the hashed value.

    Args:
        password (str): The plain text password to verify.
        hashed_password (str): The hashed password to check against.

    Returns:
        bool: True if the password matches, False otherwise.
    """
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))

def main():
    print(hash_password(getpass.getpass("Password to hash: ")))

if __name__ == "__main__":
    main()
