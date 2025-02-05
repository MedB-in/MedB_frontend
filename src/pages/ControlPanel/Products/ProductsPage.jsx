import React, { useState, useEffect } from "react";
import { getProduct, addProduct, editProduct } from "../../../services/products";
import toast, { Toaster } from "react-hot-toast";
import ProductModal from "../../../components/Organs/Products/ProductModal";
import MenuToProductModal from "../../../components/Organs/Products/ProductMenuModal";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productData, setProductData] = useState(null);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const productData = await getProduct();
      setProducts(productData.data.products || []);
    } catch (err) {
      setError("Failed to fetch products");
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setProductData(null);
    setIsProductModalOpen(true);
  };

  const handleAddProductMenu = (productId) => {
    setSelectedProductId(productId);
    setIsMenuModalOpen(true);
  };

  const handleEditProduct = (productId) => {
    const productToEdit = products.find((product) => product.productId === productId);
    setProductData(productToEdit);
    setIsProductModalOpen(true);
  };

  const handleSubmit = async (data) => {

    try {
      let response;
      if (data?.productId) {
        response = await editProduct(data.productId, data);
        toast.success("Product updated successfully");
      } else {
        response = await addProduct(data);
        toast.success("Product added successfully");
      }

      await fetchProducts();
      setIsProductModalOpen(false);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error(error.message || "Something went wrong");
    }
  };

  const toggleProductModules = (productId) => {
    setExpandedProductId((prevId) => (prevId === productId ? null : productId));
  };


  return (
    <section className="p-4">
      <Toaster />
      <div className="overflow-x-auto">
        <div className="flex justify-center gap-5 items-center py-4 px-4">
          <button className="py-2 px-4 border rounded hover:bg-blue-500 hover:text-white" onClick={handleAddProduct}>
            Add Product
          </button>
        </div>
        {loading && <p className="text-center">Loading products...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        <table className="min-w-full">
          <thead>
            <tr className="text-left">
              <th className="py-2 px-4">Product ID</th>
              <th className="py-2 px-4">Product Name</th>
              <th className="py-2 px-4">Price</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <React.Fragment key={product?.productId}>
                <tr className="border-b">
                  <td className="py-2 px-4">{product?.productId}</td>
                  <td className="py-2 px-4">{product.productName}</td>
                  <td className="py-2 px-4">{product.amount || "Free"}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleEditProduct(product?.productId)}>
                      Edit
                    </button>
                    <button
                      className="py-2 px-4 border rounded hover:bg-blue-500 hover:text-white"
                      onClick={() => handleAddProductMenu(product?.productId)}
                    >
                      Add Menu to Product
                    </button>
                    <button
                      className="font-bold text-blue-500 px-4 py-2 rounded"
                      onClick={() => toggleProductModules(product?.productId)}
                    >
                      {expandedProductId === product?.productId ? "Hide Modules" : "Show Modules"}
                    </button>
                  </td>
                </tr>

                {expandedProductId === product?.productId && product.modules && product.modules.length > 0 && (
                  <tr>
                    <td colSpan="4" className="px-4 py-2 bg-gray-100">
                      <ul>
                        {product.modules.map((module) => (
                          <li key={module.moduleId} className="mb-2">
                            <strong>{module.moduleName}</strong>
                            <ul className="ml-4">
                              {module.menus.map((menu) => (
                                <li key={menu.menuId}>
                                  <img
                                    src={menu.menuIcon}
                                    alt={menu.menuName}
                                    className="w-6 h-6 inline-block mr-2"
                                  />
                                  {menu.menuName} ({menu.actionName})
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        closeModal={() => setIsProductModalOpen(false)}
        productData={productData}
        onSubmit={handleSubmit}
      />

      {/* Menu Modal for adding menu to product */}
      <MenuToProductModal
        isOpen={isMenuModalOpen}
        closeModal={() => setIsMenuModalOpen(false)}
        productId={selectedProductId}
        fetchProducts={fetchProducts}
      />
    </section>
  );
};

export default ProductPage;