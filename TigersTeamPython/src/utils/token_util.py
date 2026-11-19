from itsdangerous import URLSafeTimedSerializer as Serializer

from src.core.config import settings

SECRET_KEY = settings.SECRET_KEY

def generate_confirmation_token(email):
    serializer = Serializer(SECRET_KEY)
    return serializer.dumps(email, salt="email-confirm")

def confirm_token(token, expiration=3600):
    serializer = Serializer(SECRET_KEY)
    try:
        email = serializer.loads(token, salt="email-confirm", max_age=expiration)
    except:
        return False
    return email
