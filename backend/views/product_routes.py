from flask import Blueprint, request, jsonify
from models import Product, db, Wishlist, Order, Review
from werkzeug.utils import secure_filename
import logging
import os

product_bp = Blueprint("product_bp", __name__)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Where the photos will be for testing
UPLOAD_FOLDER = "static/uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# _______________________________________________________

# CREATING A PRODUCT \
@product_bp.route("/products", methods=['POST'])
def create_product():
    # Using form-data instead of json() because of images
    name = request.form.get("name")
    description = request.form.get("description")
    price = request.form.get("price")
    availability = request.form.get("availability", 0)

    if not all([name, description, price]):
        return jsonify({"error": "Missing required fields"}), 400
    
    image_filename = None
    if "image_filename" in request.files:
        file = request.files["image_filename"]
        if file and allowed_file(file.filename):
            image_filename = secure_filename(file.filename)
            file.save(os.path.join(UPLOAD_FOLDER, image_filename))

    new_product = Product (
        name = name,
        description = description,
        price = float(price),
        availability = int(availability),
        image_filename = image_filename
    )

    db.session.add(new_product)
    db.session.commit()

    return jsonify({
        "id": new_product.id,
        "name": new_product.name,
        "description": new_product.description,
        "price": new_product.price,
        "availability": new_product.availability,
        "image_filename": new_product.image_filename
    }), 201

# _______________________________________________________

# FETCH ALL PRODUCTS \
@product_bp.route("/products", methods=['GET']) 
def get_all_products():
    products = Product.query.all()

    products_list = [{
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "availability": product.availability,
        "image_filename": product.image_filename,
    } for product in products]

    return jsonify({"products": products_list}), 200

# _______________________________________________________

# FETCH A SINGLE PRODUCT \
@product_bp.route("/products/<int:id>", methods=['GET'])
def get_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({"error": "Product not found"}), 404
    return jsonify({
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "availability": product.availability,
        "image_filename": product.image_filename
    }), 200

# _______________________________________________________

# UPDATE PRODUCT \
@product_bp.route("/products/<int:id>", methods=['PATCH'])
def update_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({"error": "Product not found"}), 404
    
    data = request.get_json()
    for key, value in data.items():
        if hasattr(product, key):
            setattr(product, key, value)
    
    db.session.commit()
    return jsonify({"message": "Product updated successfully"}), 200

# _______________________________________________________

# UPDATING PRODUCT AVAILABILITY \
@product_bp.route("/products/<int:id>/availability", methods=['PATCH'])
def update_availability(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    data = request.get_json()

    if "availability" not in data:
        return jsonify({"error": "Missing 'availability' field"}), 400

    new_stock = data["availability"]
    if not isinstance(new_stock, int) or new_stock < 0:
        return jsonify({"error": "'availability' must be a non-negative integer"}), 400

    product.availability = new_stock
    db.session.commit()

    in_stock = new_stock > 0
    return jsonify({
        "message": "Availability updated successfully",
        "id": product.id,
        "availability": product.availability,
        "in_stock": in_stock      
    }), 200

# _______________________________________________________

# DELETING A PRODUCT \
@product_bp.route("/products/<int:id>", methods=['DELETE'])
def delete_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({"error": "Product not found"}), 404
    
    try:
    # This will delete the wishlist rows first before removing the product that prevents foreign key constraint errors
        Wishlist.query.filter_by(product_id=id).delete()

    #  Delete linked orders and reviews
        Order.query.filter_by(product_id=id).delete()
        Review.query.filter_by(product_id=id).delete()

        db.session.delete(product)
        db.session.commit()

        return jsonify({"message": f"Product '{product.name}' deleted successfully"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    