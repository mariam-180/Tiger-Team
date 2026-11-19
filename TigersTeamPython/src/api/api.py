from fastapi import APIRouter

from src.api.endpoints.user_router import router as user_router
from src.api.endpoints.event_registrations_router import router as event_router
from src.api.endpoints.event_router import router as events_router
from src.api.endpoints.branch_router import router as branch_router
from src.api.endpoints.pc_router import router as pc_router
from src.api.endpoints.reservation_router import router as reservation_router
from src.api.endpoints.reports_router import router as reports_router

from src.api.endpoints.products_router import router as products_router
from src.api.endpoints.categories_router import router as categories_router
from src.api.endpoints.orders_router import router as orders_router
from src.api.endpoints.order_items_router import router as order_items_router
from src.api.endpoints.controller_router import router as controller_router
from src.api.endpoints.stream_router import router as stream_router

api_router = APIRouter()

api_router.include_router(user_router)
api_router.include_router(event_router)
api_router.include_router(events_router)
api_router.include_router(branch_router)
api_router.include_router(pc_router)
api_router.include_router(reservation_router)
api_router.include_router(reports_router)
api_router.include_router(products_router)
api_router.include_router(categories_router)
api_router.include_router(orders_router)
api_router.include_router(order_items_router)
api_router.include_router(controller_router)
api_router.include_router(stream_router)
