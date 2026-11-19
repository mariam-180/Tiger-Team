class ProxyPathMiddleware:
    """Normalize stripped proxy paths when FastAPI supplies the ASGI root_path.

    Gunicorn's worker receives /users or /static/... after Nginx strips its
    public prefix. Mounted apps need path to include root_path, as it would
    when Uvicorn itself is started with --root-path.
    """

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        prefix = scope.get('root_path', '').rstrip('/')
        path = scope.get('path', '')
        if scope['type'] in {'http', 'websocket'} and prefix and path != prefix and not path.startswith(prefix + '/'):
            scope = dict(scope)
            scope['path'] = prefix + path
            if 'raw_path' in scope:
                scope['raw_path'] = prefix.encode() + scope['raw_path']
        await self.app(scope, receive, send)
