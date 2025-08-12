import { useEffect, useState } from "react";
import Button from "../../../components/Atoms/Login/Button";
import UserSearch from "../../../components/Organs/AppLogs/UserSearch";
import { addSubscription } from "../../../services/subscriptions";
import { getProduct } from "../../../services/products";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const AddSubscriptionModal = ({ isOpen, onClose, onAddSubscription }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [duration, setDuration] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchProducts = async () => {
        try {
            const response = await getProduct();
            setProducts(response.data.products || []);
        } catch (err) {
            toast.error("Failed to load products");
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchProducts();
            setSelectedUser(null);
            setSelectedProduct("");
            setStartDate("");
            setEndDate("");
            setDuration("");
        }
    }, [isOpen]);

    const addMonths = (dateStr, months) => {
        const date = new Date(dateStr);
        const originalDay = date.getDate();
        date.setMonth(date.getMonth() + months);

        if (date.getDate() !== originalDay) {
            date.setDate(0);
        }

        return date.toISOString().split("T")[0];
    };

    const handleSubmit = async () => {
        if (!selectedUser || !selectedProduct || !startDate || !endDate) {
            toast.error("All fields are required");
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start >= end) {
            toast.error("Start date must be before end date");
            return;
        }
        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            return date.toLocaleDateString("en-GB");
        };

        const confirmResult = await Swal.fire({
            title: "Confirm Subscription Details",
            html: `
            <div style="text-align: left;">
                <strong>User:</strong> ${selectedUser.firstName} ${selectedUser.middleName ? ` ${selectedUser.middleName}` : ""} ${selectedUser.lastName ? ` ${selectedUser.lastName}` : ""}<br/>
                <strong>Product:</strong> ${products.find(p => p.productId === +selectedProduct)?.productName}<br/>
                <strong>Start:</strong> ${formatDate(startDate)}<br/>
                <strong>End:</strong> ${formatDate(endDate)}
             </div>
        `,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Continue",
            cancelButtonText: "Cancel"
        });

        if (!confirmResult.isConfirmed) return;

        const fullName = [selectedUser.firstName, selectedUser.middleName, selectedUser.lastName]
            .filter(Boolean)
            .join(" ");

        const irreversibleResult = await Swal.fire({
            title: "Are you absolutely sure?",
            html: `
                    <p>This action <strong>cannot be undone</strong>.</p>
                    <p>Type <b>" ${fullName} " </b> to confirm. </p>
                    <p>(case-sensitive)</p>
                    <input id="confirm-input" class="swal2-input" autocomplete="off" placeholder="Type here" />
                `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Add",
            cancelButtonText: "Cancel",
            preConfirm: () => {
                const input = Swal.getPopup().querySelector("#confirm-input").value;
                if (input.trim() !== fullName.trim()) {
                    Swal.showValidationMessage("Username does not match");
                }
                return input;
            },
            didOpen: () => {
                const input = Swal.getPopup().querySelector("#confirm-input");
                input.setAttribute("autocomplete", "off");
                input.setAttribute("oncopy", "return false;");
                input.setAttribute("onpaste", "return false;");
                input.setAttribute("oncut", "return false;");
                input.setAttribute("oncontextmenu", "return false;");
            }
        });


        if (!irreversibleResult.isConfirmed) return;

        try {
            setLoading(true);

            await addSubscription({
                userId: selectedUser.userId,
                productId: selectedProduct,
                startOn: start,
                endOn: end,
            });

            toast.success("Subscription added successfully");
            onAddSubscription?.();
            onClose();
        } catch (error) {
            const msg = error?.response?.data?.message || error?.message || "Failed to add subscription";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <UserSearch onSelectUser={setSelectedUser} />

            <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
            >
                <option value="">Select a product</option>
                {products
                    .filter((product) => ![3, 4, 5].includes(product.productId))
                    .map((product) => (
                        <option key={product.productId} value={product.productId}>
                            {product.productName}
                        </option>
                    ))}
            </select>

            <div className="flex gap-4 items-center">
                <label className="text-sm text-gray-700 font-medium">Duration:</label>

                {["6m", "1y"].map((value) => (
                    <label key={value} className="flex items-center gap-2 text-sm">
                        <input
                            type="radio"
                            name="duration"
                            value={value}
                            checked={duration === value}
                            onChange={() => {
                                const today = new Date().toISOString().split("T")[0];
                                const start = startDate || today;
                                setStartDate(start);

                                const calculatedEnd = value === "6m"
                                    ? addMonths(start, 6)
                                    : addMonths(start, 12);

                                setDuration(value);
                                setEndDate(calculatedEnd);
                            }}
                        />
                        {value === "6m" ? "6 Months" : "1 Year"}
                    </label>
                ))}

                <button
                    className="ml-auto text-blue-500 text-sm underline"
                    onClick={() => {
                        setDuration("");
                        setStartDate("");
                        setEndDate("");
                    }}
                >
                    Clear Duration
                </button>
            </div>

            <div className="flex gap-4">
                <div className="flex flex-col w-full">
                    <label className="text-sm text-gray-600">Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
                    />
                </div>

                <div className="flex flex-col w-full">
                    <label className="text-sm text-gray-600">End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                            setEndDate(e.target.value);
                            setDuration("");
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
                    />
                </div>
            </div>

            <div className="flex justify-center pt-4">
                <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Adding..." : "Add Subscription"}
                </Button>
            </div>
        </div>
    );
};

export default AddSubscriptionModal;
