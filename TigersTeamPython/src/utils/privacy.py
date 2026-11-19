SENSITIVE = {"password", "new_password", "token", "access_token", "reset_token", "reset_token_expiry", "verification_token", "authorization", "param", "stream_key"}


def redact(value):
    if isinstance(value, dict):
        return {key: "[redacted]" if key.lower() in SENSITIVE else redact(item) for key, item in value.items()}
    if isinstance(value, list):
        return [redact(item) for item in value]
    return value
