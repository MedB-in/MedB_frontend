import { useState, useEffect } from "react";
import { getMenuList, addMenuToProduct } from "../../../services/products";
import toast from "react-hot-toast";

const ProductMenuModal = ({ isOpen, closeModal, productId, fetchProducts }) => {
  const [menuList, setMenuList] = useState([]);
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchMenuList = async () => {
        setLoading(true);
        try {
          const response = await getMenuList();

          if (response.data) {
            setMenuList(response.data.productMenu || []);
          } else {
            toast.error("No menus found.");
          }
        } catch (error) {
          toast.error("Failed to fetch menu list.");
        } finally {
          setLoading(false);
        }
      };

      fetchMenuList();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMenuId) {
      toast.error("Please select a menu.");
      return;
    }

    const data = {
      productId,
      menuId: selectedMenuId,
    };

    try {
      const response = await addMenuToProduct(data);
      toast.success(response.data.message);
      fetchProducts();
      closeModal();
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong.");
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-md shadow-lg w-xl">
          <h3 className="text-xl font-semibold mb-4">Add Menu to Product</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium">Select Menu</label>
              {loading ? (
                <div className="text-gray-500">Loading menus...</div>
              ) : menuList.length === 0 ? (
                <div className="text-red-500">No menus available.</div>
              ) : (
                <select
                  className="w-full p-2 border rounded-md"
                  onChange={(e) => setSelectedMenuId(e.target.value)}
                  value={selectedMenuId}
                  required
                >
                  <option value="">Select a menu</option>
                  {menuList.map((menu) => (
                    <option key={menu.menuId} value={menu.menuId}>
                      {menu.menuName} - {menu.actionName}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded-md"
                onClick={closeModal}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-500 text-white rounded-md"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Menu to Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default ProductMenuModal;
