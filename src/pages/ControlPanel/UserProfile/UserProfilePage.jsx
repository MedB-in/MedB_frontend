import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { updateProfile, uploadProfilePicture } from "../../../services/user";
import InputField from "../../../components/Atoms/Login/InputField";
import Button from "../../../components/Atoms/Login/Button";
import { setUserDetails } from "../../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const UserProfilePage = () => {
    const storedUser = JSON.parse(localStorage.getItem("userDetails")) || {};
    const doctor = storedUser?.doctorId ?? null;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        doctorId: doctor,
        firstName: storedUser.firstName || "",
        middleName: storedUser.middleName || "",
        lastName: storedUser.lastName || "",
        age: storedUser.age || "",
        gender: storedUser.gender || "",
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
    const [imageUploading, setImageUploading] = useState(false);
    const [profilePicturePreview, setProfilePicturePreview] = useState(storedUser.profilePicture || null);
    const [lastSavedProfilePicture, setLastSavedProfilePicture] = useState(storedUser.profilePicture || null);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleProfilePictureChange = async (e) => {
        const selectedImage = e.target.files[0];
        const maxSize = 2 * 1024 * 1024;
        if (!selectedImage || !["image/jpeg", "image/png", "image/jpg"].includes(selectedImage.type)) {
            toast.error("Please select a valid image file.");
            return;
        }
        if (selectedImage.size > maxSize) {
            toast.error("File size exceeds 2MB. Please upload a smaller image.");
            return;
        }
        setProfilePicturePreview(URL.createObjectURL(selectedImage));
        setImageUploading(true);

        const formData = new FormData();
        formData.append("image", selectedImage);
        formData.append("doctorId", doctor);

        try {
            const response = await uploadProfilePicture(formData);
            const newProfilePictureUrl = response.data.data;
            toast.success(response.data.message || "Profile picture updated successfully");

            setLastSavedProfilePicture(newProfilePictureUrl);
            setProfilePicturePreview(newProfilePictureUrl);
            setUserDetails({ ...storedUser, profilePicture: newProfilePictureUrl });
            localStorage.setItem("userDetails", JSON.stringify({ ...storedUser, profilePicture: newProfilePictureUrl }));
            window.dispatchEvent(new Event("userDetailsUpdated"))
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile picture.");
            setProfilePicturePreview(lastSavedProfilePicture);
        } finally {
            setImageUploading(false);
            e.target.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await updateProfile(formData);
            toast.success(response.data.message || "Profile updated successfully");
            setUserDetails({ ...formData, profilePicture: lastSavedProfilePicture });
            localStorage.setItem("userDetails", JSON.stringify({ ...formData, profilePicture: lastSavedProfilePicture }));
            window.dispatchEvent(new Event("userDetailsUpdated"))
            navigate("/");
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong.");
            setProfilePicturePreview(lastSavedProfilePicture);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] p-6">
            <div className="relative bg-white shadow-lg border-2 border-[#3a6ff7] rounded-3xl w-full max-w-5xl p-8">
                <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6 capitalize">
                    {doctor ? "Dr." : formData.gender === "Male" ? "Mr." : formData.gender === "Female" ? "Ms." : "Mr./Ms."} {formData.firstName} {formData.middleName ? ` ${formData.middleName}` : ''} {formData.lastName ? ` ${formData.lastName}` : ''}'s Profile
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col items-center relative mb-6">
                        {imageUploading && (
                            <div className="absolute flex items-center justify-center w-40 h-40 rounded-full bg-black bg-opacity-50">
                                <div className="border-4 border-white border-t-transparent rounded-full w-10 h-10 animate-spin"></div>
                            </div>
                        )}
                        <img
                            src={profilePicturePreview || "https://static.vecteezy.com/system/resources/thumbnails/028/149/256/small_2x/3d-user-profile-icon-png.png"}
                            alt="Profile"
                            className="w-40 h-40 rounded-full object-cover border-2 border-gray-300"
                        />
                        <p className="text-blue-600 text-sm mt-2 cursor-pointer" onClick={() => fileInputRef.current.click()}>
                            Update Profile Picture
                        </p>
                        <input type="file" name="profilePicture" onChange={handleProfilePictureChange} ref={fileInputRef} className="hidden" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <InputField type="text" name="firstName" placeholder="First Name" className="capitalize" value={formData.firstName} onChange={handleChange} required />
                        <InputField type="text" name="middleName" placeholder="Middle Name" className="capitalize" value={formData.middleName} onChange={handleChange} />
                        <InputField type="text" name="lastName" placeholder="Last Name" className="capitalize" value={formData.lastName} onChange={handleChange} />
                        <InputField type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required /><select
                            name="gender"
                            className="capitalize px-3 py-3.5 bg-white rounded-lg border border-solid border-zinc-300 text-black text-opacity-70"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>

                        <InputField type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required disabled />
                        <InputField type="phone" name="contactNo" placeholder="Contact Number" value={formData.contactNo} onChange={handleChange} required />
                        <InputField type="text" name="designation" placeholder="Designation" className="capitalize" value={doctor ? "Doctor" : formData.designation} onChange={handleChange} disabled={!!doctor} />
                        <InputField type="text" name="address" placeholder="Address" className="capitalize" value={formData.address} onChange={handleChange} />
                        <InputField type="text" name="city" placeholder="City" className="capitalize" value={formData.city} onChange={handleChange} />
                        <InputField type="text" name="district" placeholder="District" className="capitalize" value={formData.district} onChange={handleChange} />
                        <InputField type="text" name="state" placeholder="State" className="capitalize" value={formData.state} onChange={handleChange} />
                        <InputField type="text" name="country" placeholder="Country" className="capitalize" value={formData.country} onChange={handleChange} />
                        <InputField type="text" name="postalCode" placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} />
                    </div>
                    <div className="flex justify-center items-center mt-6">
                        <Button variant="primary" disabled={loading}>
                            {loading ? "Updating..." : "Update Profile"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfilePage;
