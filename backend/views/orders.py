from flask import Blueprint, request, jsonify
from models import Order, Product, User, db
from flask_jwt_extended import jwt_required, get_jwt_identity
import logging

order_bp = Blueprint("order_bp", __name__)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# _______________________________________________________

# CREATE AN ORDER \
@order_bp.route("/orders", methods=['POST'])
@jwt_required()
def create_order():
    data = request.get_json()

    user_id = get_jwt_identity()
    product_id = data.get("product_id")
    quantity = data.get("quantity")

    if not all([product_id, quantity]):
        return jsonify({"error": "product_id and quantity are required"}), 400

    if quantity <= 0:
        return jsonify({"error": "Quantity must be at least 1"}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    if product.availability == 0:
        return jsonify({"error": "Product is out of stock"}), 400

    if quantity > product.availability:
        return jsonify({"error": f"Only {product.availability} item(s) left in stock"}), 400

    total_price = product.price * quantity
    product.availability -= quantity

    new_order = Order(
        user_id=user_id,
        product_id=product_id,
        quantity=quantity,
        total_price=total_price
    )

    db.session.add(new_order)
    db.session.commit()

    return jsonify({
        "message": "Order placed successfully",
        "order": {
            "id": new_order.id,
            "user_id": new_order.user_id,
            "product_id": new_order.product_id,
            "product_name": product.name,
            "quantity": new_order.quantity,
            "total_price": new_order.total_price,
            "remaining_stock": product.availability
        }
    }), 201

# _______________________________________________________

# FETCH ALL ORDERS (admin view) \
@order_bp.route("/orders", methods=['GET'])
@jwt_required()
def get_all_orders():
    # orders = Order.query.all()
    orders = db.session.query(Order, User).join(User, Order.user_id == User.id).all()

    if not orders:
        return jsonify({"message": "No orders found", "orders": []}), 200

    orders_list = [{
        "id": order.id,
        "user_id": order.user_id,
        "user_name": user.name,
        "user_email": user.email,
        "product_id": order.product_id,
        "product_name": order.product.name,
        "quantity": order.quantity,
        "total_price": order.total_price,
        "payment_status": order.payment.status if order.payment else "unpaid"
    } for order, user in orders]

    return jsonify({"orders": orders_list}), 200

# _______________________________________________________

# FETCH ALL ORDERS FOR A USER \
@order_bp.route("/orders/user", methods=['GET']) 
@jwt_required()
def get_user_orders():
    user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=user_id).all()

    if not orders:
        return jsonify({"message": "No orders found", "orders": []}), 200

    orders_list = [{
        "id": order.id,
        "product_id": order.product_id,
        "product_name": order.product.name,
        "product_image": order.product.image_filename,
        "quantity": order.quantity,
        "total_price": order.total_price,
        "payment_status": order.payment.status if order.payment else "unpaid"
    } for order in orders]

    return jsonify({"orders": orders_list}), 200

# _______________________________________________________

# FETCH A SINGLE ORDER \
@order_bp.route("/orders/<int:order_id>", methods=['GET'])
@jwt_required()
def get_order(order_id):
    user_id = get_jwt_identity()

    order = Order.query.get(order_id)

    if not order:
        return jsonify({"error": "Order not found"}), 404

    # Users can only view their own orders
    if order.user_id != int(user_id):
        return jsonify({"error": "Unauthorized"}), 403

    return jsonify({
        "id": order.id,
        "user_id": order.user_id,
        "product_id": order.product_id,
        "product_name": order.product.name,
        "product_image": order.product.image_filename,
        "quantity": order.quantity,
        "total_price": order.total_price,
        "payment_status": order.payment.status if order.payment else "unpaid"
    }), 200

# _______________________________________________________

# CANCEL AN ORDER \
@order_bp.route("/orders/<int:order_id>", methods=['DELETE'])
@jwt_required()
def cancel_order(order_id):
    user_id = get_jwt_identity()
    order = Order.query.get(order_id)

    if not order:
        return jsonify({"error": "Order not found"}), 404

    # Users can only cancel their own orders
    if order.user_id != int(user_id):
        return jsonify({"error": "Unauthorized"}), 403

    if order.payment and order.payment.status == "paid":
        return jsonify({"error": "Cannot cancel a paid order"}), 400

    product = Product.query.get(order.product_id)
    if product:
        product.availability += order.quantity

    db.session.delete(order)
    db.session.commit()

    return jsonify({"message": "Order cancelled successfully"}), 200