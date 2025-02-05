import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const ProductModal = ({ isOpen, closeModal, productData, onSubmit }) => {
    const [productId, setProductId] = useState("");
    const [productName, setProductName] = useState("");
    const [productType, setProductType] = useState("");
    const [description, setDescription] = useState("");
    const [notes, setNotes] = useState("");
    const [values, setValues] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [isActive, setIsActive] = useState(true);
    const [isFree, setIsFree] = useState(true);
    const [isTrial, setIsTrial] = useState(true);
    const [amount, setAmount] = useState("");
    const [taxAmount, setTaxAmount] = useState("");
    const [netAmount, setNetAmount] = useState("");
    const [trialDays, setTrialDays] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setProductId(productData?.productId || "");
        setProductName(productData?.productName || "");
        setProductType(productData?.productType || "");
        setDescription(productData?.description || "");
        setNotes(productData?.notes || "");
        setValues(productData?.values || "");
        setIsPublic(productData?.isPublic !== undefined ? productData.isPublic : true);
        setIsActive(productData?.isActive !== undefined ? productData.isActive : true);
        setIsFree(productData?.isFree !== undefined ? productData.isFree : true);
        setIsTrial(productData?.isTrial !== undefined ? productData.isTrial : true);
        setAmount(productData?.amount || "");
        setTaxAmount(productData?.taxAmount || "");
        setNetAmount(productData?.netAmount || "");
        setTrialDays(productData?.trialDays || "");
    }, [productData]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (isNaN(amount) || isNaN(taxAmount) || isNaN(netAmount) || isNaN(trialDays)) {
            toast.error("Please enter valid numeric values for amount, tax, net amount, and trial days.");
            return;
        }

        const data = {
            productId,
            productName,
            productType,
            description,
            notes,
            values,
            isPublic,
            isActive,
            isFree,
            isTrial,
            amount: parseFloat(amount),
            taxAmount: parseFloat(taxAmount),
            netAmount: parseFloat(netAmount),
            trialDays: parseInt(trialDays),
        };


        if (data.productName && data.productType && data.description) {
            setLoading(true);
            try {
                await onSubmit(data);
                handleCancel();
            } catch (error) {
                toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
            } finally {
                setLoading(false);
            }
        } else {
            toast.error("Please fill out all required fields.");
        }
    };

    const handleCancel = () => {
        setProductId("");
        setProductName("");
        setProductType("");
        setDescription("");
        setNotes("");
        setValues("");
        setIsPublic(true);
        setIsActive(true);
        setIsFree(true);
        setIsTrial(true);
        setAmount("");
        setTaxAmount("");
        setNetAmount("");
        setTrialDays("");
        closeModal();
    };

    return (
        isOpen && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-md shadow-lg w-96 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-xl font-semibold mb-4">
                        {productData ? "Edit Product" : "Add New Product"}
                    </h3>
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Product Name</label>
                            <input
                                type="text"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Product Type</label>
                            <input
                                type="text"
                                value={productType}
                                onChange={(e) => setProductType(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Values</label>
                            <textarea
                                value={values}
                                onChange={(e) => setValues(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Amount</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Tax Amount</label>
                            <input
                                type="number"
                                value={taxAmount}
                                onChange={(e) => setTaxAmount(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Net Amount</label>
                            <input
                                type="number"
                                value={netAmount}
                                onChange={(e) => setNetAmount(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Trial Days</label>
                            <input
                                type="number"
                                value={trialDays}
                                onChange={(e) => setTrialDays(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={isPublic}
                                    onChange={(e) => setIsPublic(e.target.checked)}
                                    className="form-checkbox"
                                />
                                <span>Public</span>
                            </label>
                        </div>
                        <div className="mb-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="form-checkbox"
                                />
                                <span>Active</span>
                            </label>
                        </div>
                        <div className="mb-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={isFree}
                                    onChange={(e) => setIsFree(e.target.checked)}
                                    className="form-checkbox"
                                />
                                <span>Free</span>
                            </label>
                        </div>
                        <div className="mb-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={isTrial}
                                    onChange={(e) => setIsTrial(e.target.checked)}
                                    className="form-checkbox"
                                />
                                <span>Trial</span>
                            </label>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-300 rounded-md"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-500 text-white rounded-md"
                                disabled={loading}
                            >
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
