from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.testclient import TestClient
from src.core.proxy_path import ProxyPathMiddleware


def test_proxy_root_path_does_not_break_static_mounts(tmp_path):
    (tmp_path / 'image.txt').write_text('asset')
    application = FastAPI(root_path='/api')
    application.add_middleware(ProxyPathMiddleware)
    application.mount('/static', StaticFiles(directory=tmp_path))
    with TestClient(application) as client:
        assert client.get('/static/image.txt').text == 'asset'
        assert client.get('/api/static/image.txt').text == 'asset'


def test_proxy_root_path_is_added_only_once():
    application = FastAPI(root_path='/api')
    application.add_middleware(ProxyPathMiddleware)

    @application.get('/health')
    def health():
        return {'ok': True}

    with TestClient(application) as client:
        assert client.get('/health').json() == {'ok': True}
        assert client.get('/api/health').json() == {'ok': True}
