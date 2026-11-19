import os
import shutil
import tempfile
from pathlib import Path
from typing import Optional

from fastapi import UploadFile
from PIL import Image


STATIC_ROOT = Path(__file__).resolve().parents[2] / "static"

def save_image(
    image: UploadFile,
    product_name: str,
    category: Optional[str] = None, 
    upload_dir: str = "static/images/",
    max_size: tuple = (800, 800),
) -> Optional[str]:
    """
    Save an uploaded image after resizing and compressing it into a category-specific directory as a WebP file.

    Args:
        image (UploadFile): The uploaded image file.
        category (Optional[str]): The category under which the image will be saved.
        upload_dir (str): The base directory where the image will be saved.
        max_size (tuple): The maximum width and height for the resized image.

    Returns:
        Optional[str]: The relative path to the saved image or None if no image is uploaded.
    """
    if not image:
        return None

    product_name = Path(product_name).name.replace(" ", "_")
    if category:
        category = Path(category).name.replace(" ", "_")
        upload_dir = os.path.join(upload_dir, category)

    upload_path = Path(upload_dir)
    if not upload_path.is_absolute():
        upload_path = STATIC_ROOT.parent / upload_path
    upload_path.mkdir(parents=True, exist_ok=True)

    webp_image_path = upload_path / f"{product_name}.webp"
    temporary = tempfile.NamedTemporaryFile(dir=upload_path, suffix=".upload", delete=False)
    source_path = Path(temporary.name)
    try:
        with temporary as buffer:
            shutil.copyfileobj(image.file, buffer)
        with Image.open(source_path) as img:
            img.thumbnail(max_size, Image.LANCZOS)
            img.save(webp_image_path, format="WebP", quality=85, optimize=True)
    finally:
        source_path.unlink(missing_ok=True)

    return webp_image_path.relative_to(STATIC_ROOT).as_posix()

def delete_image(image_path: str) -> bool:
    """
    Delete an image file if it exists.

    Args:
        image_path (str): The relative or absolute path to the image to delete.

    Returns:
        bool: True if the file was successfully deleted, False otherwise.
    """
    try:
        path = Path(image_path)
        if not path.is_absolute():
            path = STATIC_ROOT / path
        path = path.resolve()
        if not path.is_relative_to(STATIC_ROOT.resolve()):
            return False
        if path.exists():
            path.unlink()
            return True
        return False
    except Exception as e:
        print(f"Error deleting image: {e}")
        return False
