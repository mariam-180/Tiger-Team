# main.py
import os
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.encoders import jsonable_encoder
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, OperationalError
from src.infra.db.engine import engine
from src.utils.privacy import redact
from src.core.proxy_path import ProxyPathMiddleware
from src.core.live_updates import router as updates_router, ChangeNotificationMiddleware

from src.api.api import api_router
from src.core.config import settings
from src.infra.errors import (
    CustomHTTPException,
    DatabaseOperationException,
    DuplicateRecordException,
    ExpiredSignatureError,
    ForbiddenException,
    InsufficientStockException,
    InvalidRoleConfigurationException,
    ProductOutOfStockException,
    RecordNotFoundException,
    UnauthorizedException,
    InsufficientCreditException,
    BaseException,
)
from src.logger.log import setup_logger
# from src.utils.email_util import send_verification_email
# from src.core.socket_config import app as socket_app

app = FastAPI(
    title=settings.PROJECT_NAME,
    root_path=settings.API_ROOT_PATH,
    redirect_slashes=False,
)

app.include_router(api_router)
app.include_router(updates_router)
app.add_middleware(ChangeNotificationMiddleware)


@app.exception_handler(IntegrityError)
async def integrity_error_handler(request: Request, exc: IntegrityError):
    return JSONResponse(status_code=409, content={"detail": "This change conflicts with an existing or related record."})


@app.exception_handler(OperationalError)
async def operational_error_handler(request: Request, exc: OperationalError):
    code = exc.orig.args[0] if exc.orig.args else None
    status_code = 409 if code in {1205, 1213} else 503
    return JSONResponse(status_code=status_code, content={"detail": "Database operation could not complete. Please try again."})

logger = setup_logger()

origins = [
    "http://localhost:3000",
    "http://localhost",
    "http://tigers-team.com",
    "https://tigers-team.com",
    "http://www.tigers-team.com",
    "https://www.tigers-team.com",
]

# Add CORSMiddleware to the application
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(ProxyPathMiddleware)

# app.include_router(api_router)

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
static_dir = os.path.join(parent_dir, "static")
os.makedirs(static_dir, exist_ok=True)

app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/")
def read_root():
    return {"message": "Hello World!"}


@app.get("/health")
def health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
    except Exception:
        return JSONResponse(status_code=503, content={"status": "unavailable", "service": "database"})
    return {"status": "ok", "service": "api"}


# Mount the ASGI app directly
# app.mount("/socket.io", socket_app)


@app.exception_handler(DuplicateRecordException)
async def duplicate_record_exception_handler(
    request: Request, exc: DuplicateRecordException
):
    try:
        body = redact(await request.json())
    except Exception as e:
        body = f"Failed to read request body: {e}"
    logger.error(
        f"Duplicated record error for request {request.url.path} with data {body}: {exc.error_msg}"
    )

    response_content = {"failure_detail": exc.error_msg}

    if exc.field:
        response_content["field"] = exc.field
        logger.error(f"Field: {response_content['field']}")

    return JSONResponse(
        status_code=exc.status_code,
        content=response_content,
    )


@app.exception_handler(RecordNotFoundException)
async def record_not_found_exception_handler(
    request: Request, exc: RecordNotFoundException
):
    try:
        body = redact(await request.json())
    except Exception as e:
        body = f"Failed to read request body: {e}"
    if "/orders" in str(request.url):
        logger.error(f"Order processing failed for {request.url.path}, Body: {body}")
    logger.error(
        f"Record not found error for request {request.url.path} with data {body}: {exc.error_msg}"
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={"failure_detail": exc.error_msg},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    try:
        body = redact(await request.json())
    except Exception as e:
        body = f"Failed to read request body: {e}"
    errors = [{"loc": error["loc"], "msg": error["msg"], "type": error["type"]} for error in exc.errors()]
    logger.error(f"Validation error for request {request.url.path}: {errors}, Body: {body}")
    return JSONResponse(
        status_code=422,
        content=jsonable_encoder({"detail": errors}),
    )


@app.exception_handler(UnauthorizedException)
async def unauthorized_exception_handler(request: Request, exc: UnauthorizedException):
    try:
        body = redact(await request.json())
    except Exception as e:
        body = f"Failed to read request body: {e}"
    errors = exc.error_msg
    logger.error(f"Unauthorized user for request {request.url.path}: {errors}, Body: {body}")
    return JSONResponse(
        status_code=401,
        content={"detail": errors},
    )


@app.exception_handler(ForbiddenException)
async def forbidden_exception_handler(request: Request, exc: ForbiddenException):
    try:
        body = redact(await request.json())
    except Exception as e:
        body = f"Failed to read request body: {e}"
    logger.error(
        f"Forbidden error for request {request.url.path}: {exc.detail}, Body: {body}"
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": "Permission denied!"},
    )


@app.exception_handler(ExpiredSignatureError)
async def expired_signature_exception_handler(
    request: Request, exc: ExpiredSignatureError
):
    try:
        body = redact(await request.json())
    except Exception as e:
        body = f"Failed to read request body: {e}"
    logger.error(f"Expired token for request {request.url.path}, Body: {body}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


@app.exception_handler(InvalidRoleConfigurationException)
async def invalid_role_configuration_exception_handler(
    request: Request, exc: InvalidRoleConfigurationException
):
    try:
        body = redact(await request.json())
    except Exception as e:
        body = f"Failed to read request body: {e}"
    logger.error(
        f"Invalid role configuration for request {request.url.path}: {exc.detail}, Body: {body}"
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": "Invalid role configuration."},
    )


@app.exception_handler(InsufficientCreditException)
async def insufficient_credit_exception_handler(
    request: Request, exc: InsufficientCreditException
):
    try:
        body = redact(await request.json())
    except Exception as e:
        body = f"Failed to read request body: {e}"
    logger.error(
        f"Insufficient credit for request {request.url.path}: {exc.detail}, Body: {body}"
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


@app.exception_handler(BaseException)
async def base_exception_handler(request: Request, exc: BaseException):
    try:
        body = redact(await request.json())
    except Exception as e:
        body = f"Failed to read request body: {e}"
    logger.error(
        f"Base exception for request {request.url.path}: {exc.error_msg}, Body: {body}"
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.error_msg},
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    try:
        body = redact(await request.json())
    except Exception as e:
        body = f"Failed to read request body: {e}"
    logger.error(
        f"Unexpected error for request {request.url.path}: {type(exc).__name__}, Body: {body}"
    )
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred."},
    )


@app.exception_handler(DatabaseOperationException)
async def database_operation_exception_handler(
    request: Request, exc: DatabaseOperationException
):
    try:
        body = redact(await request.json())
    except Exception as e:
        body = f"Failed to read request body: {e}"
    logger.error(
        f"Database operation error for request {request.url.path} with data {body}: {exc.message}"
    )
    return JSONResponse(
        status_code=500,
        content={"failure_detail": exc.message},
    )


@app.exception_handler(CustomHTTPException)
async def custom_http_exception_handler(request: Request, exc: CustomHTTPException):
    try:
        body = redact(await request.json())
    except Exception as e:
        body = f"Failed to read request body: {e}"
    logger.error(
        f"Custom HTTP error for request {request.url.path} with data {body}: {exc.detail}"
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )

@app.exception_handler(ProductOutOfStockException)
async def product_out_of_stock_exception_handler(request: Request, exc: ProductOutOfStockException):
    try:
        body = redact(await request.json())
    except Exception as e:
        body = f"Failed to read request body: {e}"
    logger.error(
        f"Product out of stock for request {request.url.path}: {exc.error_msg}, Body: {body}"
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.error_msg},
    )

@app.exception_handler(InsufficientStockException)
async def insufficient_stock_exception_handler(
    request: Request, exc: InsufficientStockException
):
    try:
        body = redact(await request.json())
    except Exception as e:
        body = f"Failed to read request body: {e}"
    
    logger.error(
        f"Insufficient stock for request {request.url.path}: {exc.detail}, "
        f"Product ID: {exc.product_id}, "
        f"Requested Quantity: {exc.requested_quantity}, "
        f"Current Stock: {exc.current_stock}, "
        f"Body: {body}"
    )
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "product_id": exc.product_id,
            "requested_quantity": exc.requested_quantity,
            "current_stock": exc.current_stock,
        },
    )
