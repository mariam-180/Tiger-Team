import os
from pathlib import Path

import requests

# API URL for creating products
products_api_url = os.getenv("PRODUCTS_API_URL", "http://localhost:8081/products")
access_token = os.getenv("ACCESS_TOKEN")
image_path = os.getenv("PRODUCT_IMAGE_PATH")

if not access_token:
    raise RuntimeError("Set ACCESS_TOKEN before running this maintenance script")
if not image_path or not Path(image_path).is_file():
    raise RuntimeError("Set PRODUCT_IMAGE_PATH to an existing image file")


def truncate_description(description, max_length=255):
    return description[:max_length]

products = [
    {
        "id": 34,
        "image_path": image_path
    },
]

headers = {
    "Authorization": f"Bearer {access_token}",
    "accept": "application/json"
}

def create_product(product_data):
    data = {}
    if "name" in product_data and product_data["name"]:
        data["name"] = product_data["name"]
    if "category_id" in product_data:
        data["category_id"] = product_data["category_id"]
    if "price" in product_data:
        data["price"] = product_data["price"]
    if "stock_quantity" in product_data:
        data["stock_quantity"] = product_data["stock_quantity"]
    if "is_lowest_price" in product_data:
        data["is_lowest_price"] = str(product_data["is_lowest_price"]).lower()
    if "description" in product_data and product_data["description"]:
        data["description"] = product_data["description"]

    product_id = product_data["id"]

    files = {}
    if "image_path" in product_data and product_data["image_path"]:
        image_path = product_data["image_path"]
        files["image"] = open(image_path, "rb")

    response = requests.patch(f"{products_api_url}/{product_id}", data=data, files=files, headers=headers)
    
    if response.status_code == 200:
        print(f"Product '{product_data['id']}' updated successfully.")
    else:
        print(f"Failed to update product '{product_data['id']}': {response.status_code} - {response.text}")

# Create the product(s)
for product in products:
    create_product(product)
