import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getClinicList } from "../../../services/clinics";
import LocationSelector from "../../LocationSelector";
import { UploadIcon } from "lucide-react";
import Swal from "sweetalert2";
import { medicalDepartments } from "../../../lib/medicalDepartments";
import { isValidAge, isValidName, isValidPhone, isValidPincode } from "../../../validation/validations";
import { getActiveClinics } from "../../../services/publicApi";

const DoctorModal = ({ isOpen, closeModal, doctorData, clinicId, fromClinic, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [clinicSearch, setClinicSearch] = useState("");
  const [clinicResults, setClinicResults] = useState([]);
  const [selfClinic, setSelfClinic] = useState(false);
  const [doctorPictureFile, setDoctorPictureFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFromDropdown, setSelectedFromDropdown] = useState(false);

  useEffect(() => {
    if (selectedFromDropdown) {
      setSelectedFromDropdown(false);
      return;
    }

    if (clinicSearch.trim() && !clinicId) {
      const fetchClinics = async () => {
        try {
          const response = await getActiveClinics(clinicSearch);
          const clinics = response?.data?.clinics || [];
          setClinicResults(clinics);
          setShowDropdown(true);
        } catch (error) {
          toast.error(error.response?.data?.message || "Something went wrong.");
        }
      };
      fetchClinics();
    } else {
      setClinicResults([]);
      setShowDropdown(false);
    }
  }, [clinicSearch]);

  const defaultFormData = {
    doctorId: "",
    clinicId: clinicId || "",
    firstName: "",
    middleName: "",
    lastName: "",
    age: '',
    registration: "",
    doctorOverview: "",
    clinicOverview: "",
    speciality: "",
    email: "",
    phone: "",
    profilePicture: "",
    gender: "",
    qualifications: "",
    experience: "",
    location: { type: "Point", coordinates: [0, 0] },
    address: "",
    city: "",
    district: "",
    state: "",
    country: "",
    postalCode: "",
    isActive: false,
    isVerified: false,
    isOwnClinic: false,
    website: "",
  };

  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    if (doctorData) {
      setFormData({
        ...defaultFormData,
        ...doctorData,
        clinicId: doctorData.clinic?.clinicId || clinicId || "",
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [doctorData, clinicId]);

  const handleSelfClinicChange = (e) => {
    const { checked } = e.target;
    setSelfClinic(checked);
    setFormData({ ...formData, clinicId: "" });
    setClinicSearch("");
    setClinicResults([]);
    setFormData((prev) => ({
      ...prev,
      isOwnClinic: checked,
    }));
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 2 * 1024 * 1024;
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPG, JPEG, or PNG).");
      return;
    }
    if (file.size > maxSize) {
      toast.error("File size exceeds 2MB. Please upload a smaller image.");
      return;
    }
    setDoctorPictureFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        formDataToSend.append(key, JSON.stringify(value));
      } else {
        formDataToSend.append(key, value);
      }
    });
    if (!selfClinic && !formData.clinicId) {
      toast.error("Please select a clinic.");
      return;
    }
    if (!isValidName(formData.firstName.trim())) {
      toast.error("First name must contain only letters.");
      return;
    }
    if (formData.middleName && !isValidName(formData.middleName.trim())) {
      toast.error("Middle name must contain only letters.");
      return;
    }
    if (formData.lastName && !isValidName(formData.lastName.trim())) {
      toast.error("Last name must contain only letters.");
      return;
    }
    if (formData.phone && !isValidPhone(formData.phone)) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    if (!isValidPincode(formData.postalCode)) {
      toast.error("Please enter a valid pincode.");
      return;
    }
    if (!formData.experience || !isValidAge(formData.experience)) {
      toast.error("Please enter a valid experience.");
      return;
    }
    if (doctorPictureFile) {
      formDataToSend.append("image", doctorPictureFile);
    }

    try {
      setLoading(true);
      await onSubmit(formDataToSend, formData.doctorId);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (lat, lng, address, city, district, state, country, postalCode) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
      address,
      city,
      district,
      state,
      country,
      postalCode,
    }));
  };

  const handleCloseModal = () => {
    if (JSON.stringify(formData) !== JSON.stringify(defaultFormData)) {
      Swal.fire({
        title: "Are you sure?",
        text: "Any unsaved changes will be lost!",
        showCancelButton: true,
        confirmButtonText: "Yes, close it!",
        cancelButtonText: "No, keep editing",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          setFormData(defaultFormData);
          closeModal();
        }
      });
    } else {
      setFormData(defaultFormData);
      closeModal();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-[400px] max-h-[90vh] overflow-auto">
        <h3 className="text-xl font-semibold mb-4">
          {doctorData ? "Edit Doctor" : "Add New Doctor"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Profile Picture (click to upload)</label>
            <div className="relative w-full mb-4 h-40 rounded-md flex items-center justify-center">
              {formData.profilePicture && !previewImage && <img src={formData.profilePicture} alt="Clinic" className="w-32 h-32 object-cover" />}
              {previewImage ? (
                <img src={previewImage} alt="Clinic" className="h-full w-full object-contain rounded-md" />
              ) : (
                !formData.profilePicture && (
                  <UploadIcon className="h-10 w-10 text-gray-400" />)
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                onChange={handleFileChange}
              />
            </div>
          </div>
          {!clinicId && !doctorData && !selfClinic && (
            <div className="mb-4 relative">
              <label className="block text-sm font-medium mb-1 text-gray-700">Clinic</label>
              <div className="relative">
                <input
                  type="text"
                  value={clinicSearch}
                  onChange={(e) => {
                    setClinicSearch(e.target.value);
                    setFormData({ ...formData, clinicId: "" });
                  }}
                  onFocus={() => {
                    if (clinicResults.length > 0) setShowDropdown(true);
                  }}
                  placeholder="Search clinic by name or address"
                  className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {clinicSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setClinicSearch("");
                      setFormData({ ...formData, clinicId: "" });
                      setClinicResults([]);
                      setShowDropdown(false);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 focus:outline-none"
                  >
                    ✖
                  </button>
                )}
              </div>
              {showDropdown && clinicResults.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {clinicResults.map((clinic) => (
                    <li
                      key={clinic.clinicId}
                      onClick={() => {
                        setFormData({ ...formData, clinicId: clinic.clinicid });
                        setClinicSearch(clinic.name);
                        setClinicResults([]);
                        setShowDropdown(false);
                        setSelectedFromDropdown(true);
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-indigo-100"
                    >
                      {clinic.name}{clinic.address ? `, ${clinic.address}` : ""}
                    </li>
                  ))}
                </ul>
              )}
              {showDropdown && clinicSearch.trim() && clinicResults.length === 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md px-4 py-2 text-sm text-gray-500">
                  No matching clinics found.
                </div>
              )}
            </div>
          )}
          {!doctorData && (
            <div className="mb-4 flex items-center space-x-2">
              <input type="checkbox" name="isOwnClinic" checked={formData.isOwnClinic} onChange={handleSelfClinicChange} className="form-checkbox" />
              <span>Clinic By Doctor (Own Clinic)</span>
            </div>
          )}
          {selfClinic && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium">Website for Clinic</label>
                <input type="text" name="website" value={formData.website} onChange={handleChange} className="w-full p-2 border rounded-md" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Clinic Overview</label>
                <input type="text" name="clinicOverview" value={formData.clinicOverview} onChange={handleChange} className="w-full p-2 border rounded-md" />
              </div>
            </>
          )}
          <div className="mb-4 grid grid-cols-3 gap-2">
            <div>
              <label className="block text-sm font-medium">First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-2 border rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Middle Name</label>
              <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
          </div>
          <div className="mb-4 grid grid-cols-2 gap-2">
            <div className="mb-4">
              <label className="block text-sm font-medium">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border rounded-md" required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full p-2 border rounded-md" required />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Registration</label>
            <input type="text" name="registration" value={formData.registration} onChange={handleChange} className="w-full p-2 border rounded-md" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Specialization</label>
            <select
              name="speciality"
              value={formData.speciality}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select Specialization</option>
              {Object.keys(medicalDepartments).map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Qualifications</label>
            <input type="text" name="qualifications" value={formData.qualifications} onChange={handleChange} className="w-full p-2 border rounded-md" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Doctor Overview</label>
            <input type="text" name="doctorOverview" value={formData.doctorOverview} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Experience (Years)</label>
            <input type="number" name="experience" value={formData.experience} onChange={handleChange} className="w-full p-2 border rounded-md" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded-md" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Phone</label>
            <input type="tel" name="phone" value={formData.phone} onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,10}$/.test(value)) {
                handleChange(e);
              }
            }}
              maxLength={10}
              pattern="\d{10}"
              inputMode="numeric"
              className="w-full p-2 border rounded-md"
              title="Phone number must be 10 digits"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Location</label>
            <LocationSelector onSelect={handleLocationSelect} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded-md" required />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium">City</label>
              <input type="text" name="city" value={formData.city} className="w-full p-2 border rounded-md cursor-default" />
            </div>
            <div>
              <label className="block text-sm font-medium">District</label>
              <input type="text" name="district" value={formData.district} className="w-full p-2 border rounded-md cursor-default" required />
            </div>
          </div>
          <div className="mb-4 grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium">State</label>
              <input type="text" name="state" value={formData.state} className="w-full p-2 border rounded-md cursor-default" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Country</label>
              <input type="text" name="country" value={formData.country} className="w-full p-2 border rounded-md cursor-default" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Postal Code</label>
              <input type="text" name="postalCode" value={formData.postalCode} maxLength={6} pattern="\d{6}" inputMode="numeric" onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,6}$/.test(value)) {
                  setFormData(prev => ({ ...prev, postalCode: value }));
                }
              }}
                className="w-full p-2 border rounded-md cursor-default"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium"></label>
              <input type="text" name="" value="" className="" />
            </div>
            <div className="mb-4 flex items-center space-x-2">
              <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="form-checkbox" />
              <span>Active</span>
            </div>
            {!clinicId && (
              <div className="mb-4 flex items-center space-x-2">
                <input type="checkbox" name="isVerified" checked={formData.isVerified} onChange={handleChange} className="form-checkbox" />
                <span>Verified</span>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" className="px-4 py-2 bg-gray-300 rounded-md" onClick={handleCloseModal} disabled={loading}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded-md" disabled={loading}>{loading ? "Saving..." : doctorData ? "Update" : "Add Doctor"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorModal;