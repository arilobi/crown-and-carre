from flask import Blueprint
from models import Payment, db, Order, Product

payment_bp = Blueprint("payment_bp", __name__)