from flask import Blueprint, jsonify, request
from models import User, db, TokenBlockList
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, get_jwt
from datetime import datetime, timezone, timedelta
import re

auth_bp = Blueprint("auth_bp", __name__)

# LOGIN \
@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate user and return JWT token."""
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=str(user.id), expires_delta=timedelta(hours=False))

    return jsonify({
        "access_token": access_token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "is_admin": user.role.lower() == "admin"
        }
    }), 200


#  FETCH CURRENT USER DETAILS \
@auth_bp.route("/current_user", methods=["GET"])
@jwt_required()
def current_user():
    try:
        user = User.query.get(int(get_jwt_identity()))

        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "is_admin": user.role.lower() == "admin"
        }), 200
    
    except Exception as e:
        print(f"current_user error: {e}")
        return jsonify({"error": str(e)}), 500

# LOGOUT - This will go to the tokenblocklist \
@auth_bp.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    """Blacklist a token on logout."""
    try:
        jti = get_jwt()["jti"]
        
        # Check if token is already blacklisted
        existing = TokenBlockList.query.filter_by(jti=jti).first()
        if existing:
            return jsonify({"message": "Already logged out"}), 200
        
        # Add to blocklist
        blocked_token = TokenBlockList(
            jti=jti, 
            created_at=datetime.now(timezone.utc)
        )
        db.session.add(blocked_token)
        db.session.commit()
        
        return jsonify({"success": "Logged out successfully"}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Logout error: {e}")
        return jsonify({"error": "Logout failed"}), 500