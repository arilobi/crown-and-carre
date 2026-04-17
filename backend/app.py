from flask import Flask, request, redirect, session
from flask_cors import CORS
from flask_migrate import Migrate
from models import db, User, TokenBlockList
from dotenv import load_dotenv
import os
from werkzeug.security import generate_password_hash
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from flask_jwt_extended import JWTManager
import secrets
import string

# Load environment variables
load_dotenv()

# Initialize app
app = Flask(__name__)
CORS(app)

# SECRET KEY (for sessions)
app.secret_key = os.getenv("JWT_SECRET_KEY") or "dev-secret-key"

# Database config
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://art_e_commerce_user:DfVq61hCl9qG4e1mN4JA8Ixv5DJpnNeG@dpg-d7h32tegvqtc73et298g-a.oregon-postgres.render.com/art_e_commerce')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)

# JWT config
app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET_KEY')
app.config["JWT_ACCESS_TOKEN_EXPIRE"] = False
jwt = JWTManager(app)

# GOOGLE CONFIG 

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

SCOPES = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "openid"
]

def create_flow():
    return Flow.from_client_config(
        {
            "web": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token"
            }
        },
        scopes=SCOPES,
        redirect_uri=GOOGLE_REDIRECT_URI
    )

# GOOGLE ROUTES

@app.route("/authorize_google")
def authorize_google():
    flow = create_flow()

    authorization_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true"
    )

    session["state"] = state
    return redirect(authorization_url)

@app.route("/google_login/callback")
def google_callback():
    
    if session.get("state") != request.args.get("state"):
        return "State mismatch error", 400

    flow = create_flow()
    flow.fetch_token(authorization_response=request.url)

    credentials = flow.credentials
    session["credentials"] = credentials_to_dict(credentials)

    user_info = get_user_info(credentials)

    user = User.query.filter_by(email=user_info["email"]).first()

    if not user:
        hashed_password = generate_password_hash(generate_random_password())

        user = User(
            name=user_info["name"],
            email=user_info["email"],
            password=hashed_password
        )
        db.session.add(user)
        db.session.commit()

    session["user_info"] = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    }

    return redirect("https://crown-and-carre.onrender.com/login")

def credentials_to_dict(credentials):
    return {
        "token": credentials.token,
        "refresh_token": credentials.refresh_token,
        "token_uri": credentials.token_uri,
        "client_id": credentials.client_id,
        "client_secret": credentials.client_secret,
        "scopes": credentials.scopes
    }

def get_user_info(credentials):
    service = build("oauth2", "v2", credentials=credentials)
    user_info = service.userinfo().get().execute()
    return {
        "email": user_info["email"],
        "name": user_info["name"],
        "picture": user_info["picture"]
    }

def generate_random_password(length=12):
    characters = string.ascii_letters + string.digits
    return ''.join(secrets.choice(characters) for _ in range(length))


from views.user_routes import user_bp
from views.product_routes import product_bp
from views.payments_routes import payment_bp
from views.auths import auth_bp
from views.orders import order_bp
from views.wishlist_routes import wishlist_bp
from views.review_routes import review_bp

app.register_blueprint(user_bp)
app.register_blueprint(product_bp)
app.register_blueprint(payment_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(order_bp)
app.register_blueprint(wishlist_bp)
app.register_blueprint(review_bp)

if __name__ == "__main__":
    app.run(debug=True)