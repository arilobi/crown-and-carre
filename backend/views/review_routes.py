from flask import Blueprint, request, jsonify
from models import Review, Product, Order, db
from flask_jwt_extended import jwt_required, get_jwt_identity
import logging

review_bp = Blueprint("review_bp", __name__)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# _______________________________________________________

# ADD A REVIEW
@review_bp.route("/reviews", methods=['POST'])
@jwt_required()
def add_review():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    product_id = data.get("product_id")
    rating = data.get("rating")
    comment = data.get("comment")

    if not product_id or not rating:
        return jsonify({"error": "product_id and rating are required"}), 400

    if not isinstance(rating, int) or rating < 1 or rating > 5:
        return jsonify({"error": "Rating must be between 1 and 5"}), 400

    # Check product exists
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    # Only allow reviews if user has ordered the product
    # has_ordered = Order.query.filter_by(
    #     user_id=user_id,
    #     product_id=product_id
    # ).first()
    # if not has_ordered:
    #     return jsonify({"error": "You can only review products you have ordered"}), 403

    # Check for duplicate review
    existing = Review.query.filter_by(user_id=user_id, product_id=product_id).first()
    if existing:
        return jsonify({"error": "You have already reviewed this product"}), 409

    new_review = Review(
        user_id=user_id,
        product_id=product_id,
        rating=rating,
        comment=comment
    )

    db.session.add(new_review)
    db.session.commit()

    return jsonify({
        "message": "Review added successfully",
        "review": {
            "id": new_review.id,
            "product_id": new_review.product_id,
            "rating": new_review.rating,
            "comment": new_review.comment,
            "created_at": new_review.created_at
        }
    }), 201

# _______________________________________________________

# GET ALL REVIEWS FOR A PRODUCT /
@review_bp.route("/reviews/product/<int:product_id>", methods=['GET'])
def get_product_reviews(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    reviews = Review.query.filter_by(product_id=product_id).all()

    if not reviews:
        return jsonify({"message": "No reviews yet", "reviews": []}), 200

    # Calculate average rating
    avg_rating = sum(r.rating for r in reviews) / len(reviews)

    reviews_list = [{
        "id": review.id,
        "user_id": review.user_id,
        "user_name": review.user.name,
        "rating": review.rating,
        "comment": review.comment,
        "created_at": review.created_at
    } for review in reviews]

    return jsonify({
        "product_id": product_id,
        "average_rating": round(avg_rating, 1),
        "total_reviews": len(reviews),
        "reviews": reviews_list
    }), 200

# _______________________________________________________

# GET ALL REVIEWS BY A USER /
@review_bp.route("/reviews/user", methods=['GET'])
@jwt_required()
def get_user_reviews():
    user_id = int(get_jwt_identity())
    reviews = Review.query.filter_by(user_id=user_id).all()

    if not reviews:
        return jsonify({"message": "No reviews yet", "reviews": []}), 200

    reviews_list = [{
        "id": review.id,
        "product_id": review.product_id,
        "product_name": review.product.name,
        "product_image": review.product.image_filename,
        "rating": review.rating,
        "comment": review.comment,
        "created_at": review.created_at
    } for review in reviews]

    return jsonify({"reviews": reviews_list}), 200

# _______________________________________________________

# UPDATE A REVIEW /
@review_bp.route("/reviews/<int:review_id>", methods=['PATCH'])
@jwt_required()
def update_review(review_id):
    user_id = int(get_jwt_identity())
    review = Review.query.get(review_id)

    if not review:
        return jsonify({"error": "Review not found"}), 404

    if review.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()

    if "rating" in data:
        if not isinstance(data["rating"], int) or data["rating"] < 1 or data["rating"] > 5:
            return jsonify({"error": "Rating must be between 1 and 5"}), 400
        review.rating = data["rating"]

    if "comment" in data:
        review.comment = data["comment"]

    db.session.commit()

    return jsonify({
        "message": "Review updated successfully",
        "review": {
            "id": review.id,
            "rating": review.rating,
            "comment": review.comment
        }
    }), 200

# _______________________________________________________

# DELETE A REVIEW
@review_bp.route("/reviews/<int:review_id>", methods=['DELETE'])
@jwt_required()
def delete_review(review_id):
    user_id = int(get_jwt_identity())
    review = Review.query.get(review_id)

    if not review:
        return jsonify({"error": "Review not found"}), 404

    if review.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(review)
    db.session.commit()

    return jsonify({"message": "Review deleted successfully"}), 200