import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FiPackage, 
    FiTruck, 
    FiMap, 
    FiCalendar, 
    FiCheck, 
    FiX, 
    FiRefreshCw,
    FiLogOut,
    FiUser,
    FiPhone,
    FiMail,
    FiTrello,
    FiCreditCard,
    FiAlertCircle,
    FiDollarSign,
    FiClock,
    FiDroplet,
    FiStar,
    FiEdit,
    FiTrash2
} from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import DeliveryDetailsForm from './DeliveryDetailsForm';

const DeliveryPersonDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [profile, setProfile] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [deliveryStats, setDeliveryStats] = useState({
        pendingDeliveries: 0,
        inTransit: 0,
        completed: 0,
        totalDeliveries: 0
    });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [showDeliveryForm, setShowDeliveryForm] = useState(false);
    const [selectedOrderForDetails, setSelectedOrderForDetails] = useState(null);
    const [deliveryDetails, setDeliveryDetails] = useState([]);
    const [stats, setStats] = useState({
        totalDeliveries: 0,
        totalEarnings: 0,
        totalMileage: 0,
        averageRating: 0
    });
    const [editDetail, setEditDetail] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [deleteDetail, setDeleteDetail] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('deliveryPersonToken');
        if (!token) {
            navigate('/delivery-person-login');
            return;
        }

        fetchProfile();
    }, [navigate]);

    useEffect(() => {
        if (profile) {
            fetchAssignedOrders();
            fetchDeliveryDetails();
        }
    }, [profile]);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('deliveryPersonToken');
            const response = await axios.get('http://localhost:5000/api/delivery/delivery-person/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(response.data.deliveryPerson);
        } catch (error) {
            console.error('Error fetching profile:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error('Session expired. Please login again.');
                localStorage.removeItem('deliveryPersonToken');
                navigate('/delivery-person-login');
            } else {
                toast.error('Failed to fetch profile');
            }
        }
    };

    const fetchAssignedOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('deliveryPersonToken');
            const response = await axios.get(
                'http://localhost:5000/api/delivery/delivery-person/orders',
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const ordersData = Array.isArray(response.data) ? response.data : [];
            
            // Transform the orders data to match the frontend structure
            const transformedOrders = ordersData.map(order => ({
                _id: order._id,
                customerName: `${order.firstName} ${order.lastName}`,
                customerEmail: order.email,
                shippingAddress: order.shippingAddress,
                deliveryStatus: order.deliveryStatus || 'processing',
                totalPrice: order.totalAmount,
                paymentMethod: order.paymentMethod,
                paymentStatus: order.paymentStatus,
                items: order.items.map(item => ({
                    product: {
                        name: `${item.BrandName} ${item.ModelName}`,
                    },
                    quantity: item.quantity,
                    imageUrl: item.imageUrl || null,
                    price: item.price || (order.totalAmount / order.items.reduce((sum, i) => sum + i.quantity, 0))
                }))
            }));

            setOrders(transformedOrders);
            
            // Calculate stats
            const stats = {
                pendingDeliveries: transformedOrders.filter(order => order.deliveryStatus === 'processing').length,
                inTransit: transformedOrders.filter(order => order.deliveryStatus === 'pickedup').length,
                completed: transformedOrders.filter(order => order.deliveryStatus === 'delivered').length,
                totalDeliveries: transformedOrders.length
            };
            
            setDeliveryStats(stats);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error('Session expired. Please login again.');
                localStorage.removeItem('deliveryPersonToken');
                navigate('/delivery-person-login');
            } else {
                toast.error(error.response?.data?.message || 'Failed to fetch orders');
            }
            setLoading(false);
        }
    };

    const fetchDeliveryDetails = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('deliveryPersonToken');
            
            const response = await axios.get(
                'http://localhost:5000/api/delivery/person/delivery-details',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setDeliveryDetails(response.data.details);
                
                // Calculate statistics
                const details = response.data.details;
                const stats = {
                    totalDeliveries: details.length,
                    totalEarnings: details.reduce((sum, detail) => sum + detail.deliveryCost, 0),
                    totalMileage: details.reduce((sum, detail) => sum + detail.mileage, 0),
                    averageRating: details.reduce((sum, detail) => sum + (detail.rating || 0), 0) / details.length || 0
                };
                setStats(stats);
            }
        } catch (error) {
            console.error('Error fetching delivery details:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                navigate('/delivery-person-login');
            } else {
                toast.error('Failed to fetch delivery details. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('deliveryPersonToken');
            const response = await axios.put(
                `http://localhost:5000/api/delivery/delivery-person/orders/${orderId}/status`,
                { deliveryStatus: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                // Update orders state
                setOrders(prevOrders => prevOrders.map(order => {
                    if (order._id === orderId) {
                        return { ...order, deliveryStatus: newStatus };
                    }
                    return order;
                }));

                // Update stats
                fetchAssignedOrders();
                toast.success('Order status updated successfully');
            } else {
                throw new Error(response.data.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error('Session expired. Please login again.');
                localStorage.removeItem('deliveryPersonToken');
                navigate('/delivery-person-login');
            } else {
                toast.error(error.response?.data?.message || 'Failed to update order status');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('deliveryPersonToken');
        navigate('/delivery-person-login');
    };

    const handleDeliveryDetailsSubmit = async (details) => {
        try {
            await fetchAssignedOrders(); // Refresh orders after submission
            await fetchDeliveryDetails(); // Refresh delivery details after submission
            toast.success('Delivery details submitted successfully');
        } catch (error) {
            console.error('Error refreshing orders:', error);
            toast.error('Failed to refresh orders list');
        }
    };

    const OrderDetailsModal = () => (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold">Order Details</h2>
                    <button
                        onClick={() => setShowOrderDetails(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FiX className="w-6 h-6" />
                    </button>
                </div>
                {selectedOrder && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="font-semibold">Order Information</p>
                                <p>Order ID: {selectedOrder._id}</p>
                                <p>Status: <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    selectedOrder.deliveryStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                    selectedOrder.deliveryStatus === 'pickedup' ? 'bg-blue-100 text-blue-800' :
                                    selectedOrder.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {selectedOrder.deliveryStatus.charAt(0).toUpperCase() + selectedOrder.deliveryStatus.slice(1)}
                                </span></p>
                                <p>Total: Rs.{selectedOrder.totalPrice.toFixed(2)}</p>
                                <p>Payment Method: {selectedOrder.paymentMethod}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Customer Information</p>
                                <p>Name: {selectedOrder.customerName}</p>
                                <p>Email: {selectedOrder.customerEmail}</p>
                                <p>Shipping Address: {selectedOrder.shippingAddress}</p>
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold mb-2">Order Items</p>
                            <div className="space-y-2">
                                {selectedOrder.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <div className="flex items-center space-x-2">
                                            {item.imageUrl && (
                                                <img src={item.imageUrl} alt={item.product.name} className="w-12 h-12 object-cover rounded" />
                                            )}
                                            <span>{item.product.name} x {item.quantity}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-600">Price: Rs.{(item.price).toFixed(2)}</div>
                                            <div className="font-medium">Total: Rs.{(item.price * item.quantity).toFixed(2)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between font-semibold">
                                <span>Total Amount:</span>
                                <span>Rs.{selectedOrder.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // Handler for updating delivery detail
    const handleEditDeliveryDetail = (detail) => {
        setEditDetail(detail);
        setShowEditForm(true);
    };

    const handleUpdateDeliveryDetail = async (updatedDetail) => {
        try {
            const token = localStorage.getItem('deliveryPersonToken');
            const response = await axios.put(
                `http://localhost:5000/api/delivery/delivery-person/orders/${updatedDetail.orderId}/details`,
                {
                    deliveryCost: Number(updatedDetail.deliveryCost),
                    mileage: Number(updatedDetail.mileage),
                    petrolCost: Number(updatedDetail.petrolCost),
                    timeSpent: Number(updatedDetail.timeSpent),
                    additionalNotes: updatedDetail.additionalNotes || ''
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.data.success) {
                toast.success('Delivery detail updated successfully');
                setShowEditForm(false);
                setEditDetail(null);
                fetchDeliveryDetails();
            } else {
                throw new Error(response.data.message || 'Failed to update delivery detail');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update delivery detail');
        }
    };

    // Handler for deleting delivery detail
    const handleDeleteDeliveryDetail = (detail) => {
        setDeleteDetail(detail);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteDeliveryDetail = async () => {
        if (!deleteDetail) return;
        try {
            const token = localStorage.getItem('deliveryPersonToken');
            const response = await axios.delete(
                `http://localhost:5000/api/delivery/delivery-person/orders/${deleteDetail.orderId}/details`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.data.success) {
                toast.success('Delivery detail deleted successfully');
                setShowDeleteConfirm(false);
                setDeleteDetail(null);
                fetchDeliveryDetails();
            } else {
                throw new Error(response.data.message || 'Failed to delete delivery detail');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete delivery detail');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile and Stats Section */}
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">My Deliveries</h1>
                    <p className="text-lg text-gray-600 mb-6">Welcome back, <span className="font-semibold text-blue-700">{profile?.name}</span></p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
                            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                                <FiPackage size={28} />
                            </div>
                            <div>
                                <p className="text-md text-gray-500">Pending</p>
                                <p className="text-3xl font-bold text-gray-900">{deliveryStats.pendingDeliveries}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                <FiTruck size={28} />
                            </div>
                            <div>
                                <p className="text-md text-gray-500">In Transit</p>
                                <p className="text-3xl font-bold text-gray-900">{deliveryStats.inTransit}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
                            <div className="p-3 rounded-full bg-green-100 text-green-600">
                                <FiCheck size={28} />
                            </div>
                            <div>
                                <p className="text-md text-gray-500">Completed</p>
                                <p className="text-3xl font-bold text-gray-900">{deliveryStats.completed}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
                            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                                <FiCalendar size={28} />
                            </div>
                            <div>
                                <p className="text-md text-gray-500">Total</p>
                                <p className="text-3xl font-bold text-gray-900">{deliveryStats.totalDeliveries}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow transition"
                    >
                        <FiUser className="text-lg" />
                        {showProfile ? 'Hide Profile' : 'View Profile'}
                    </button>
                    <button
                        onClick={fetchAssignedOrders}
                        className="flex items-center gap-2 px-5 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-semibold shadow transition"
                    >
                        <FiRefreshCw className="text-lg" />
                        Refresh Orders
                    </button>
                    <button
                        onClick={fetchDeliveryDetails}
                        className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow transition"
                    >
                        <FiRefreshCw className="text-lg" />
                        Refresh Details
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold shadow transition"
                    >
                        <FiLogOut className="text-lg" />
                        Logout
                    </button>
                </div>
                {/* Profile Section */}
                {showProfile && profile && (
                    <div className="mb-8 bg-white rounded-2xl shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-3">
                                <FiUser className="text-blue-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Full Name</p>
                                    <p className="font-medium">{profile.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <FiMail className="text-blue-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{profile.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <FiPhone className="text-blue-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-medium">{profile.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <FiTrello className="text-blue-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Vehicle Number</p>
                                    <p className="font-medium">{profile.vehicleNumber}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <FiCreditCard className="text-blue-500" />
                                <div>
                                    <p className="text-sm text-gray-500">License Number</p>
                                    <p className="font-medium">{profile.licenseNumber}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <FiCheck className="text-blue-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <p className="font-medium capitalize">{profile.status}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Orders Table */}
                <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
                    <h2 className="text-xl font-bold mb-4">Assigned Orders</h2>
                    {orders.length === 0 ? (
                        <div className="text-center py-8">
                            <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No Orders</h3>
                            <p className="mt-1 text-sm text-gray-500">You don't have any orders assigned yet.</p>
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="overflow-x-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 overflow-y-auto" style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#D1D5DB #F3F4F6',
                                msOverflowStyle: '-ms-autohiding-scrollbar'
                            }}>
                                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                                    <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Order ID</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Customer</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Address</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Items</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.map((order, idx) => (
                                            <tr key={order._id} className={idx % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-gray-50 hover:bg-blue-50'}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {order._id.substring(0, 8)}...
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                                                    <div className="text-sm text-gray-500">{order.customerEmail}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {order.shippingAddress}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {order.items?.map((item, index) => (
                                                        <div key={index} className="mb-1">
                                                            {item.quantity}x {item.product?.name || 'Product'}
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        order.deliveryStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.deliveryStatus === 'pickedup' ? 'bg-blue-100 text-blue-800' :
                                                        order.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {order.deliveryStatus.charAt(0).toUpperCase() + order.deliveryStatus.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <select
                                                            value={order.deliveryStatus}
                                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                            className="block p-2 rounded-md border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                        >
                                                            <option value="processing">Processing</option>
                                                            <option value="pickedup">Picked Up</option>
                                                            <option value="delivered">Delivered</option>
                                                        </select>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedOrder(order);
                                                                setShowOrderDetails(true);
                                                            }}
                                                            className="text-blue-600 hover:text-blue-900"
                                                            title="View Order Details"
                                                        >
                                                            <FiAlertCircle className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedOrderForDetails(order);
                                                                setShowDeliveryForm(true);
                                                            }}
                                                            className="text-green-600 hover:text-green-900"
                                                            title="Submit Delivery Details"
                                                        >
                                                            <FiTruck className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
                {/* Delivery Details Table */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Delivery History</h2>
                    </div>
                    <div className="relative">
                        <div className="overflow-x-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 overflow-y-auto" style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#D1D5DB #F3F4F6',
                            msOverflowStyle: '-ms-autohiding-scrollbar'
                        }}>
                            <table className="min-w-full divide-y divide-gray-200 table-fixed">
                                <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Order ID</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Delivery Cost</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Mileage</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Petrol Cost</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Time Spent</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {deliveryDetails.map((detail, idx) => (
                                        <tr key={detail.orderId} className={idx % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-gray-50 hover:bg-blue-50'}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {detail.orderId.substring(0, 8)}...
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {detail.submittedAt ? new Date(detail.submittedAt).toLocaleDateString() : ''}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                Rs. {detail.deliveryCost.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {detail.mileage.toFixed(1)} km
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                Rs. {detail.petrolCost.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {detail.timeSpent.toFixed(1)} hours
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Completed
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                                                <button
                                                    onClick={() => handleEditDeliveryDetail(detail)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                    title="Edit"
                                                >
                                                    <FiEdit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteDeliveryDetail(detail)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-300"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {deliveryDetails.length === 0 && (
                        <div className="text-center py-8">
                            <FiTruck className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No Delivery Details</h3>
                            <p className="mt-1 text-sm text-gray-500">You haven't submitted any delivery details yet.</p>
                        </div>
                    )}
                </div>
            </div>
            {/* Order Details Modal */}
            {showOrderDetails && <OrderDetailsModal />}
            {/* Delivery Details Form Modal */}
            {showDeliveryForm && selectedOrderForDetails && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-[1000] backdrop-blur-sm">
                    <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 z-[1001]">
                        <div className="bg-white rounded-lg shadow-xl p-6">
                            <h2 className="text-2xl font-bold mb-6">Submit Delivery Details</h2>
                            <DeliveryDetailsForm
                                orderId={selectedOrderForDetails._id}
                                onSubmit={handleDeliveryDetailsSubmit}
                                onClose={() => {
                                    setShowDeliveryForm(false);
                                    setSelectedOrderForDetails(null);
                                }}
                                initialValues={editDetail}
                            />
                        </div>
                    </div>
                </div>
            )}
            {/* Edit Delivery Details Modal */}
            {showEditForm && editDetail && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-[1000] backdrop-blur-sm">
                    <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 z-[1001]">
                        <div className="bg-white rounded-lg shadow-xl p-6">
                            <h2 className="text-2xl font-bold mb-6">Edit Delivery Details</h2>
                            <DeliveryDetailsForm
                                orderId={editDetail.orderId}
                                onSubmit={handleUpdateDeliveryDetail}
                                onClose={() => {
                                    setShowEditForm(false);
                                    setEditDetail(null);
                                }}
                                initialValues={editDetail}
                            />
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && deleteDetail && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-[1000] backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full z-[1001]">
                        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                        <p className="mb-6">Are you sure you want to delete this delivery detail?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteDeliveryDetail}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeliveryPersonDashboard;