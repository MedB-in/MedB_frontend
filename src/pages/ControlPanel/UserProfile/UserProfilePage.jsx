import { useState } from "react";
import toast from "react-hot-toast";
import { updateProfile } from "../../../services/user";
import InputField from "../../../components/Atoms/Login/InputField";
import Button from "../../../components/Atoms/Login/Button";

const UserProfilePage = () => {
    const storedUser = JSON.parse(localStorage.getItem("userDetails")) || {};

    const [formData, setFormData] = useState({
        firstName: storedUser.firstName || "",
        middleName: storedUser.middleName || "",
        lastName: storedUser.lastName || "",
        email: storedUser.email || "",
        contactNo: storedUser.contactNo || "",
        designation: storedUser.designation || "",
        address: storedUser.address || "",
        city: storedUser.city || "",
        district: storedUser.district || "",
        state: storedUser.state || "",
        country: storedUser.country || "",
        postalCode: storedUser.postalCode || "",
    });

    const [loading, setLoading] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleProfilePictureChange = (e) => {
        const selectedImage = e.target.files[0];
        if (selectedImage && ["image/jpeg", "image/png", "image/gif"].includes(selectedImage.type)) {
            setProfilePicture(selectedImage);
            setProfilePicturePreview(URL.createObjectURL(selectedImage));
        } else {
            toast.error("Please select a valid image file.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formDataWithProfilePicture = new FormData();
            formDataWithProfilePicture.append("formData", JSON.stringify(formData));
            if (profilePicture) formDataWithProfilePicture.append("profilePicture", profilePicture);
            const response = await updateProfile(formDataWithProfilePicture);
            toast.success(response.data.message || "Profile updated successfully");
            localStorage.setItem("userDetails", JSON.stringify(formData));
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex justify-center items-center p-4 bg-white">
                <div className="w-full max-w-3xl px-6 py-8 bg-white shadow-lg rounded-3xl">
                    <h1 className="text-2xl font-semibold text-gray-900 text-center mb-8">User Profile</h1>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="flex flex-col items-center mb-4">
                            {profilePicturePreview ? (
                                <img src={profilePicturePreview} alt="Profile Picture" className="w-40 h-40 rounded-full object-cover" />
                            ) : (
                                <img src="https://static.vecteezy.com/system/resources/thumbnails/028/149/256/small_2x/3d-user-profile-icon-png.png" alt="Profile Picture" className="w-40 h-40 rounded-full object-cover" />
                            )}
                            {/* <p className="text-gray-600 text-sm mt-2 cursor-pointer" onClick={() => document.getElementsByName("profilePicture")[0].click()}>Edit Profile Picture</p> */}
                            <input type="file" name="profilePicture" onChange={handleProfilePictureChange} className="hidden" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                            <InputField type="text" name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleChange} />
                            <InputField type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
                            <InputField type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required disabled />
                            <InputField type="phone" name="contactNo" placeholder="Contact Number" value={formData.contactNo} onChange={handleChange} required />
                            <InputField type="text" name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} />
                            <InputField type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
                            <InputField type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
                            <InputField type="text" name="district" placeholder="District" value={formData.district} onChange={handleChange} />
                            <InputField type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} />
                            <InputField type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} />
                            <InputField type="text" name="postalCode" placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} />
                        </div>
                        <Button type="submit" className="w-full bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800" disabled={loading}>
                            {loading ? "Updating..." : "Update Profile"}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default UserProfilePage;