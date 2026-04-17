from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, db
from werkzeug.security import generate_password_hash
import logging
import re
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

user_bp = Blueprint("user_bp", __name__)

# Password & Email rules to contain special characters
PASSWORD_REGEX = r"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$"
EMAIL_REGEX = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"

logging.basicConfig(level=logging.INFO)

# Stop brute force login attempts & prevents DDoS attacks
limiter = Limiter(
    key_func=get_remote_address, # Identifies users by their IP address
    default_limits=["100 per minute"] # Each IP can only make 100 requests per minute across all endpoints
)

def init_limiter(app):
    limiter.init_app(app)

# Check if a user is an admin
def is_admin(user_id):
    """Check if a user has admin role."""
    user = User.query.get(user_id)
    return user and user.role and user.role.lower() == 'admin'

# _______________________________________________________

# CREATING A USER / REGISTER \
@user_bp.route("/users", methods=['POST'])
def create_user():
    try:
        data = request.get_json()

        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'Client').capitalize()

        # CONDITIONAL STATEMENTS TO CHECK IF EITHER ROLES DON'T EXIST
        if role not in ["Client", "Admin"]:
            return jsonify({"error": "Invalid role. Allowed roles: 'Client', 'Admin'"}), 400
        
        if not all([name, email, password]):
            return jsonify({ "error": "Name, email, and password are required"}), 400
        
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Email already in use"}), 400
        
        hashed_password = generate_password_hash(password)
        
        new_user = User(
            name = name,
            email = email,
            password = hashed_password,
            role = role
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            "message": "User created successfully",
            "user": {
                "id": new_user.id,
                "name": new_user.name,
                "email": new_user.email,
                "role": new_user.role,
                "created_at": new_user.created_at
            }
        }), 201
    
    except Exception as e:
        logging.error(f" Error creating user: {e}")
        return jsonify({"error": str(e)}), 500
    

# _______________________________________________________

# FETCHING A USER \
@user_bp.route("/users/<int:id>", methods=['GET'])
@jwt_required()
def fetch_user(id):
    current_user_id = get_jwt_identity()
    
    # Convert to int for comparison
    current_user_id = int(current_user_id)
    
    # Check if user is authorized
    if current_user_id != id and not is_admin(current_user_id):
        return jsonify({"error": "Unauthorized to view this user"}), 403

    user = User.query.get(id)

    # CHECK IF A USER EXISTS
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # RESPONSE DATA - with CORRECT attribute names
    user_data = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "created_at": user.created_at,
        "orders": [
            {
                "id": order.id,
                "product_id": order.product_id,
                "quantity": order.quantity,
                "total_price": order.total_price,
            }
            for order in user.orders  
        ],
        "wishlist": [ 
            {
                "id": item.id,
                "product_id": item.product_id,
                "product_name": item.product.name,
                "product_price": item.product.price,
                "product_image": item.product.image_filename,
                "added_at": item.added_at
            }
            for item in user.wishlist_items  
        ]
    }

    return jsonify(user_data), 200

# FETCH ALL USERS
@user_bp.route("/users", methods=['GET'])
@jwt_required()
def get_all_users():
    try:
        current_user_id = int(get_jwt_identity())
        if not is_admin(current_user_id):
            return jsonify({"error": "Unauthorized"}), 403

        users = User.query.all()
        return jsonify({
            "users": [{
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "created_at": user.created_at
            } for user in users]
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# _______________________________________________________

# UPDATING A USER (SELF \ / ADMIN \) 
@user_bp.route("/users/<int:id>", methods=['PATCH'])  
@jwt_required()
def update_user(id):
    try:
        current_user_id = get_jwt_identity()
        
        # Convert to int for comparison
        if isinstance(current_user_id, str):
            current_user_id = int(current_user_id)
        
        # Check authorization
        if current_user_id != id and not is_admin(current_user_id):
            return jsonify({"error": "Unauthorized to update this user"}), 403
        
        user = User.query.get(id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.get_json()
        
        if data.get("name"):
            user.name = data["name"].strip()
            
        if data.get("email"):
            # Email calid
            import re
            email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_regex, data["email"]):
                return jsonify({"error": "Invalid email format"}), 400
                
            # Check if email already exists
            existing_user = User.query.filter_by(email=data["email"]).filter(User.id != id).first()
            if existing_user:
                return jsonify({"error": "Email already in use"}), 409
                
            user.email = data["email"].strip()
        
        if data.get("password"):
            if len(data["password"]) < 3: 
                return jsonify({"error": "Password too short"}), 400
            user.password = generate_password_hash(data["password"])

        db.session.commit()

        return jsonify({
            "message": "User updated successfully",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        }), 200

    except Exception as e:
        print(f"Error updating user {id}: {e}")
        return jsonify({"error": str(e)}), 500
# _______________________________________________________

# DELETING A USER \
@user_bp.route("/users/<int:id>", methods=['DELETE'])
@jwt_required()
def delete_user(id):
    try:
        current_user_id = get_jwt_identity()

        user = User.query.get(id)

        if not user:
            return jsonify({"error": "User not found"}), 404
        
        if not is_admin(current_user_id) and current_user_id != id:
            return jsonify({"error": "Unauthorized to delete this user"}), 403
        
        db.session.delete(user)
        db.session.commit()

        return jsonify({"message": "User deleted successfully"}), 200
    
    except Exception as e:
        logging.error(f" Error deleting user {id}: {e}")
        return jsonify({"error": str(e)}), 500


