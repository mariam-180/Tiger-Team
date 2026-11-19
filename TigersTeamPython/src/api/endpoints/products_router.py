from fastapi import APIRouter, Depends, File, Form, UploadFile, status
from sqlalchemy.orm import Session
from typing import List, Optional

from src.infra.security.authentication import get_current_user, has_permission
from src.api.dependencies import get_db
from src.infra.crud.product_crud import (
    create_product,
    read_product_by_id,
    read_all_products,
    update_product,
    delete_product,
    read_products_by_category,
    read_products_with_pagination,
    search_products,
)
from src.infra.models.product import ProductCreate, ProductUpdate, ProductResponse
from src.infra.models.user import UserInDB, UserRole
from src.infra.models.commonEnums import Availability
from src.infra.errors import CustomHTTPException

router = APIRouter(prefix="/products", tags=["Products"])

@router.get(
    "/",
    response_model=List[ProductResponse],
    status_code=status.HTTP_200_OK,
    operation_id="product_get_all_products",
)
async def get_products(
    session: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
):
    from fastapi import HTTPException
    if skip < 0 or limit < 1 or limit > 1000:
        raise HTTPException(status_code=422, detail="Invalid pagination")
    return read_products_with_pagination(session, skip=skip, limit=limit)

@router.get(
    "/{product_id}",
    response_model=ProductResponse,
    status_code=status.HTTP_200_OK,
    operation_id="product_get_product_by_id",
)
async def get_product_by_id(
    product_id: int,
    session: Session = Depends(get_db),
):
    product = read_product_by_id(session, product_id)
    if not product:
        raise CustomHTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )
    return product

@router.get(
    "/category/{category_name}",
    response_model=List[ProductResponse],
    status_code=status.HTTP_200_OK,
    operation_id="product_get_products_by_category",
)
async def get_products_by_category(
    category_name: str,
    session: Session = Depends(get_db),
):
    return read_products_by_category(session, category_name)

@router.get(
    "/paginated/",
    response_model=List[ProductResponse],
    status_code=status.HTTP_200_OK,
    operation_id="product_get_products_with_pagination",
)
async def get_products_with_pagination(
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
    skip: int = 0,
    limit: int = 10
):
    return read_products_with_pagination(session, skip=skip, limit=limit)

@router.get(
    "/search/",
    response_model=List[ProductResponse],
    status_code=status.HTTP_200_OK,
    operation_id="product_search_products",
)
async def search_for_products(
    query: str,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user)
):
    return search_products(session, query)

@router.post(
    "/",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
    operation_id="product_create_new_product",
)
async def create_new_product(
    name: str = Form(..., min_length=1, max_length=100),
    description: str = Form(..., min_length=1),
    price: float = Form(..., ge=0, allow_inf_nan=False),
    stock_quantity: int = Form(..., ge=0),
    is_lowest_price: bool = Form(default=False),
    category_id: int = Form(...),
    img_url: Optional[str] = Form(None),
    availability: Availability = Form(default=Availability.IN_STOCK),
    show_stock_quantity: bool = Form(default=True),
    image: UploadFile = File(...),
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user)
):
    has_permission(UserRole.EMPLOYEE_USER, current_user)

    if not name.strip() or not description.strip() or not image.filename:
        from fastapi import HTTPException
        raise HTTPException(status_code=422, detail="Product name, description and image are required")
    from PIL import Image, UnidentifiedImageError
    from fastapi import HTTPException
    try:
        with Image.open(image.file) as uploaded:
            uploaded.verify()
        image.file.seek(0)
    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError):
        raise HTTPException(status_code=422, detail="Upload a valid product image")

    product = ProductCreate(
        name=name,
        description=description,
        price=price,
        stock_quantity=stock_quantity,
        is_lowest_price=is_lowest_price,
        category_id=category_id,
        img_url=img_url,
        availability=availability,
        show_stock_quantity=show_stock_quantity 
    )

    return create_product(session, product, image)

@router.patch(
    "/{product_id}",
    response_model=ProductResponse,
    status_code=status.HTTP_200_OK,
    operation_id="product_update_existing_product",
)
async def update_product_by_id(
    product_id: int,
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    price: Optional[float] = Form(None, ge=0, allow_inf_nan=False),
    stock_quantity: Optional[int] = Form(None, ge=0),
    is_lowest_price: Optional[bool] = Form(None),
    category_id: Optional[int] = Form(None),
    img_url: Optional[str] = Form(None),
    availability: Optional[Availability] = Form(None),
    show_stock_quantity: Optional[bool] = Form(None),
    image: Optional[UploadFile] = File(None),
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user)
):
    has_permission(UserRole.EMPLOYEE_USER, current_user)

    product_update_data = ProductUpdate(
        name=name,
        description=description,
        price=price,
        stock_quantity=stock_quantity,
        is_lowest_price=is_lowest_price,
        category_id=category_id,
        img_url=img_url,
        availability=availability,
        show_stock_quantity=show_stock_quantity
    )

    updated_product = update_product(session, product_id, product_update_data, image)
    if not updated_product:
        raise CustomHTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )

    return updated_product

@router.delete(
    "/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    operation_id="product_delete_existing_product",
)
async def delete_product_by_id(
    product_id: int,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user)
):
    has_permission(UserRole.SUPER_USER, current_user)

    delete_product(session, product_id)
    return {"detail": "Product deleted successfully"}
