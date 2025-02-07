import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const ProductModal = ({ isOpen, closeModal, productData, onSubmit }) => {
    const [formData, setFormData] = useState({
        productId: "",
        productName: "",
        productType: "",
        description: "",
        notes: "",
        values: "",
        isPublic: true,
        isActive: true,
        isFree: true,
        isTrial: true,
        amount: "",
        taxAmount: "",
        netAmount: "",
        trialDays: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (productData) {
            setFormData({
                ...formData,
                ...productData,
                amount: productData.amount || "",
                taxAmount: productData.taxAmount || "",
                netAmount: productData.netAmount || "",
                trialDays: productData.trialDays || "",
            });
        }
    }, [productData]);

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const { amount, taxAmount, netAmount, trialDays } = formData;

        if (![amount, taxAmount, netAmount, trialDays].every((val) => val === "" || !isNaN(Number(val)))) {
            toast.error("Please enter valid numeric values.");
            return;
        }

        setLoading(true);
        try {
            await onSubmit({
                ...formData,
                amount: parseFloat(amount),
                taxAmount: parseFloat(taxAmount),
                netAmount: parseFloat(netAmount),
                trialDays: parseInt(trialDays),
            });
            closeModal();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        isOpen && (
            <div
                className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50"
                aria-hidden={!isOpen}
                role="dialog"
            >
                <div className="bg-white p-6 rounded-md shadow-lg w-96 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-xl font-semibold mb-4">{productData ? "Edit Product" : "Add New Product"}</h3>
                    <form onSubmit={handleFormSubmit}>
                        {[
                            { label: "Product Name", name: "productName", type: "text" },
                            { label: "Product Type", name: "productType", type: "text" },
                            { label: "Description", name: "description", type: "textarea" },
                            { label: "Notes", name: "notes", type: "textarea" },
                            { label: "Values", name: "values", type: "textarea" },
                            { label: "Amount", name: "amount", type: "number" },
                            { label: "Tax Amount", name: "taxAmount", type: "number" },
                            { label: "Net Amount", name: "netAmount", type: "number" },
                            { label: "Trial Days", name: "trialDays", type: "number" },
                        ].map(({ label, name, type }) => (
                            <div className="mb-4" key={name}>
                                <label className="block text-sm font-medium">{label}</label>
                                {type === "textarea" ? (
                                    <textarea
                                        name={name}
                                        value={formData[name]}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                ) : (
                                    <input
                                        type={type}
                                        name={name}
                                        value={formData[name]}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                )}
                            </div>
                        ))}

                        {[
                            { label: "Public", name: "isPublic" },
                            { label: "Active", name: "isActive" },
                            { label: "Free", name: "isFree" },
                            { label: "Trial", name: "isTrial" },
                        ].map(({ label, name }) => (
                            <div className="mb-4 flex items-center space-x-2" key={name}>
                                <input
                                    type="checkbox"
                                    name={name}
                                    checked={formData[name]}
                                    onChange={handleChange}
                                    className="form-checkbox"
                                />
                                <span>{label}</span>
                            </div>
                        ))}

                        <div className="flex justify-end gap-4">
                            <button type="button" className="px-4 py-2 bg-gray-300 rounded-md" onClick={closeModal}>
                                Cancel
                            </button>
                            <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded-md" disabled={loading}>
                                {loading ? "Processing..." : productData ? "Update" : "Add Product"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default ProductModal;
