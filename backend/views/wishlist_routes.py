from flask import Blueprint, request, jsonify
from models import Wishlist, Product, db
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
import logging

wishlist_bp = Blueprint("wishlist_bp", __name__)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# _______________________________________________________

# ADD TO WISHLIST \
@wishlist_bp.route("/wishlist", methods=['POST'])
@jwt_required()
def add_to_wishlist():
    data = request.get_json()

    user_id = get_jwt_identity()
    product_id = data.get("product_id")

    if not user_id or not product_id:
        return jsonify({"error": "user_id and product_id are required"}), 400

    # Check if the product exists
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    # Check if the product is in stock
    if product.availability == 0:
        return jsonify({"error": "Product is out of stock"}), 400

    # Check for duplicates 
    existing = Wishlist.query.filter_by(user_id=user_id, product_id=product_id).first()
    if existing:
        return jsonify({"error": "Product already in wishlist"}), 409

    new_item = Wishlist(
        user_id=user_id,
        product_id=product_id,
        added_at=datetime.utcnow()
    )

    db.session.add(new_item)
    db.session.commit()

    return jsonify({
        "message": "Product added to wishlist",
        "wishlist_item": {
            "id": new_item.id,
            "user_id": new_item.user_id,
            "product_id": new_item.product_id,
            "added_at": new_item.added_at
        }
    }), 201

# _______________________________________________________

# FETCH ALL WISHLIST ITEMS \
@wishlist_bp.route("/wishlist", methods=['GET'])
@jwt_required()
def get_wishlist():
    user_id = get_jwt_identity()
    wishlist_items = Wishlist.query.filter_by(user_id=user_id).all()

    if not wishlist_items:
        return jsonify({"message": "Wishlist is empty", "wishlist": []}), 200

    items_list = [{
        "id": item.id,
        "product_id": item.product.id,
        "name": item.product.name,
        "description": item.product.description,
        "price": item.product.price,
        "availability": item.product.availability,
        "in_stock": item.product.availability > 0, 
        "image_filename": item.product.image_filename,
        "added_at": item.added_at
    } for item in wishlist_items]

    return jsonify({"wishlist": items_list}), 200

# _______________________________________________________

# REMOVE A SINGLE ITEM FROM WISHLIST \
@wishlist_bp.route("/wishlist/<int:wishlist_id>", methods=['DELETE'])
@jwt_required()
def remove_from_wishlist(wishlist_id):
    item = Wishlist.query.get(wishlist_id)
    if not item:
        return jsonify({"error": "Wishlist item not found"}), 404

    db.session.delete(item)
    db.session.commit()

    return jsonify({"message": "Item removed from wishlist"}), 200

# _______________________________________________________

# CLEAR ENTIRE WISHLIST FOR A USER \
@wishlist_bp.route("/wishlist/clear", methods=['DELETE'])
@jwt_required()
def clear_wishlist():
    user_id = get_jwt_identity()
    items = Wishlist.query.filter_by(user_id=user_id).all()

    if not items:
        return jsonify({"message": "Wishlist is already empty"}), 200

    Wishlist.query.filter_by(user_id=user_id).delete()
    db.session.commit()

    return jsonify({"message": "Wishlist cleared successfully"}), 200