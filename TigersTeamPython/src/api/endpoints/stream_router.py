import secrets
from urllib.parse import parse_qs, quote
import httpx
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from src.core.config import settings
from src.infra.db.tables import UserRole
from src.infra.models.user import UserInDB
from src.infra.security.authentication import get_current_user, has_permission

router = APIRouter(prefix="/stream", tags=["Streaming"])


@router.get("/config")
def get_stream_config(current_user: UserInDB = Depends(get_current_user)):
    has_permission(UserRole.EMPLOYEE_USER, current_user)
    return {
        "ingest_url": settings.SRS_INGEST_URL,
        "stream_key": f"{settings.SRS_STREAM_KEY}?token={quote(settings.SRS_PUBLISH_TOKEN, safe='')}",
        **playback_urls(),
    }


def playback_urls():
    name = quote(settings.SRS_STREAM_KEY, safe="")
    return {
        "hls_url": settings.SRS_HLS_URL or f"/hls/live/{name}.m3u8",
        "webrtc_url": settings.SRS_WEBRTC_URL or f"/rtc/v1/whep/?app=live&stream={name}",
    }


class PublishHook(BaseModel):
    action: str
    app: str
    stream: str
    param: str = ""


@router.post("/on-publish", include_in_schema=False)
def authorize_publish(hook: PublishHook):
    supplied = parse_qs(hook.param.lstrip("?")).get("token", [""])[0]
    allowed = (hook.action == "on_publish" and hook.app == "live"
               and hook.stream == settings.SRS_STREAM_KEY and bool(settings.SRS_PUBLISH_TOKEN)
               and secrets.compare_digest(supplied, settings.SRS_PUBLISH_TOKEN))
    return {"code": 0 if allowed else 403}


@router.get("/status")
async def stream_status():
    available = False
    try:
        async with httpx.AsyncClient(timeout=3) as client:
            response = await client.get(f"{settings.SRS_API_URL}/api/v1/streams/")
            response.raise_for_status()
            available = any(stream.get("name") == settings.SRS_STREAM_KEY for stream in response.json().get("streams", []))
    except (httpx.HTTPError, ValueError):
        pass
    return {"available": available, **playback_urls()}
