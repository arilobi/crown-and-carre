import { useContext, useEffect } from "react";
import { OrderContext } from "../Contexts/OrderContext";
import { UserContext } from "../Contexts/UserContext";
import { useNavigate } from "react-router-dom";
import '../components/Orders.css'; 

export default function ManageOrders() {
    const { orders, fetchAllOrders } = useContext(OrderContext);
    const { current_user, loading } = useContext(UserContext);
    const navigate = useNavigate();

    const isAdmin = current_user?.role?.toLowerCase() === "admin";

    useEffect(() => {
        if (!loading && !isAdmin) {
            navigate("/login");
        }
    }, [loading, isAdmin]);

    useEffect(() => {
        if (isAdmin) fetchAllOrders();
    }, [isAdmin]);

    if (loading) return <div className="mo-wrapper">Loading...</div>;
    if (!isAdmin) return null;

    return (
        <div className="mo-wrapper">
            <div className="mo-header">
                <h1 className="mo-title">All Orders</h1>
                <span className="mo-count">{orders.length} total</span>
            </div>

            {orders.length === 0 ? (
                <div className="mo-empty">
                    <p>No orders yet.</p>
                </div>
            ) : (
                <div className="mo-table-wrapper">
                    <table className="mo-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>User ID</th>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{order.user_id}</td>
                                    <td>{order.product_name}</td>
                                    <td>{order.quantity}</td>
                                    <td>${order.total_price}</td>
                                    <td>
                                        <span className={`mo-badge ${order.payment_status === "paid" ? "paid" : "unpaid"}`}>
                                            {order.payment_status}
                                        </span>
                                    </td>
                                    {/* <td>
                                        <button
                                            className="mo-cancel-btn"
                                            onClick={() => cancelOrder(order.id)}
                                            disabled={order.payment_status === "paid"}
                                        >
                                            Cancel
                                        </button>
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}