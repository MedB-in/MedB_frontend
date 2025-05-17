import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import LocationSelector from "../../LocationSelector";
import InputField from "../../Atoms/Input";
import Button from "../../Atoms/Button1";
import { UploadIcon } from "lucide-react";
import { isValidPhone, isValidPincode } from "../../../validation/validations";

const ClinicModal = ({ isOpen, closeModal, clinicData, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clinicPictureFile, setClinicPictureFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const defaultOpeningHours = {
    Monday: "09:00 AM - 07:00 PM",
    Tuesday: "09:00 AM - 07:00 PM",
    Wednesday: "09:00 AM - 07:00 PM",
    Thursday: "09:00 AM - 07:00 PM",
    Friday: "09:00 AM - 07:00 PM",
    Saturday: "09:00 AM - 05:00 PM",
    Sunday: "Closed",
  };

  const defaultFormData = {
    clinicId: "",
    name: "",
    address: "",
    registrationNumber: "",
    city: "",
    district: "",
    state: "",
    country: "",
    postalCode: "",
    clinicOverview: "",
    contact: "",
    email: "",
    website: "",
    clinicPicture: "",
    location: { type: "Point", coordinates: [0, 0] },
    openingHours: defaultOpeningHours,
    isActive: true,
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [timeInputs, setTimeInputs] = useState({});

  useEffect(() => {
    if (clinicData) {
      const newFormData = {
        ...defaultFormData,
        ...clinicData,
        location: clinicData.location || { type: "Point", coordinates: [0, 0] },
        openingHours: clinicData.openingHours || defaultOpeningHours,
      };
      setFormData(newFormData);
      initializeTimeInputs(newFormData.openingHours);
    } else {
      setFormData(defaultFormData);
      initializeTimeInputs(defaultOpeningHours);
    }
    setError(null);
  }, [clinicData, isOpen]);

  const initializeTimeInputs = (openingHours) => {
    const initialTimeInputs = {};
    Object.entries(openingHours).forEach(([day, timeRange]) => {
      if (!timeRange || timeRange === "Closed") {
        initialTimeInputs[day] = { isClosed: true, startTime: "", endTime: "", startPeriod: "AM", endPeriod: "PM" };
      } else {
        const [start, end] = (timeRange || "").split(" - ") || [];
        const [startTime, startPeriod] = start ? start.split(" ") : ["", "AM"];
        const [endTime, endPeriod] = end ? end.split(" ") : ["", "PM"];
        initialTimeInputs[day] = {
          isClosed: false,
          startTime,
          endTime,
          startPeriod,
          endPeriod,
        };
      }
    });
    setTimeInputs(initialTimeInputs);
  };


  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value || "",
    }));
    setError(null);
  };


  const handleTimeInputChange = (day, field, value) => {
    setTimeInputs((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));

    if (field === 'isClosed') {
      setFormData((prev) => ({
        ...prev,
        openingHours: {
          ...prev.openingHours,
          [day]: value ? "Closed" : `${timeInputs[day].startTime} ${timeInputs[day].startPeriod} - ${timeInputs[day].endTime} ${timeInputs[day].endPeriod}`,
        },
      }));
    } else {
      const updatedTimeInput = {
        ...timeInputs[day],
        [field]: value,
      };

      if (!updatedTimeInput.isClosed) {
        setFormData((prev) => ({
          ...prev,
          openingHours: {
            ...prev.openingHours,
            [day]: `${updatedTimeInput.startTime} ${updatedTimeInput.startPeriod} - ${updatedTimeInput.endTime} ${updatedTimeInput.endPeriod}`,
          },
        }));
      }
    }
    setError(null);
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
    setClinicPictureFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        formDataToSend.append(key, JSON.stringify(value));
      } else {
        formDataToSend.append(key, value);
      }
    });
    if (!isValidPhone(formData.contact)) {
      setError("Please enter a valid phone number.");
      toast.error("Please enter a valid phone number.");
      setLoading(false);
      return;
    }

    if (!isValidPincode(formData.postalCode)) {
      setError("Please enter a valid pincode.");
      toast.error("Please enter a valid pincode.");
      setLoading(false);
      return;
    }
    if (clinicPictureFile) {
      formDataToSend.append("image", clinicPictureFile);
    }
    try {
      await onSubmit(formDataToSend, formData.clinicId);
      setClinicPictureFile(null);
      setPreviewImage(null);
      closeModal();
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
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
    setError(null);
  };

  const handleCloseModal = () => {
    if (!error && JSON.stringify(formData) !== JSON.stringify(defaultFormData)) {
      if (window.confirm("Are you sure you want to close? Any unsaved changes will be lost.")) {
        setError(null);
        setFormData(defaultFormData);
        setClinicPictureFile(null);
        setPreviewImage(null);
        closeModal();
      }
    } else {
      setError(null);
      setFormData(defaultFormData);
      setClinicPictureFile(null);
      setPreviewImage(null);
      closeModal();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-[400px] max-h-[90vh] overflow-auto">
        <h3 className="text-xl font-semibold mb-4">
          {clinicData ? "Edit Clinic" : "Add New Clinic"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Clinic Picture (click to upload)</label>
            <div className="relative w-full mb-4 h-40 rounded-md flex items-center justify-center">
              {formData.clinicPicture && !previewImage && <img src={formData.clinicPicture} alt="Clinic" className="w-32 h-32 object-cover" />}
              {previewImage ? (
                <img src={previewImage} alt="Clinic" className="h-full w-full object-contain rounded-md" />
              ) : (
                !formData.clinicPicture && (
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
          <div className="mb-4">
            <InputField label="Clinic Name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <InputField label="Clinic Overview" name="clinicOverview" value={formData.clinicOverview} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Select Location</label>
            <LocationSelector onSelect={handleLocationSelect} />
          </div>
          <div className="mb-4">
            <InputField label="Address" name="address" value={formData.address} onChange={handleChange} required />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-2">
            <div>
              <InputField label="City" name="city" value={formData.city} onChange={handleChange} />
            </div>
            <div>
              <InputField label="District" name="district" value={formData.district} onChange={handleChange} required />
            </div>
          </div>
          <div className="mb-4 grid grid-cols-2 gap-2">
            <div>
              <InputField label="State" name="state" value={formData.state} onChange={handleChange} required />
            </div>
            <div>
              <InputField label="Country" name="country" value={formData.country} onChange={handleChange} required />
            </div>
            <div>
              <InputField label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium"></label>
              <input type="text" name="" value="" className="" readOnly />
            </div>
          </div>
          <div className="mb-4">
            <InputField label="Phone" type="number" name="contact" value={formData.contact} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <InputField label="Website" type="url" name="website" value={formData.website} onChange={handleChange} />
          </div>
          <div className="mb-4">
            <InputField label="Clinic Registration" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} />
          </div>
          {/* Opening Hours */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Opening Hours</label>
            {Object.keys(defaultOpeningHours).map((day) => (
              <div key={day} className="mb-4 p-3 border rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{day}</span>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={timeInputs[day]?.isClosed}
                      onChange={(e) => handleTimeInputChange(day, 'isClosed', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">Closed</span>
                  </div>
                </div>

                {!timeInputs[day]?.isClosed && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs mb-1">Opening Time</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={timeInputs[day]?.startTime}
                          onChange={(e) => handleTimeInputChange(day, 'startTime', e.target.value)}
                          placeholder="09:00"
                          className="w-20 p-1 border rounded"
                        />
                        <select
                          value={timeInputs[day]?.startPeriod}
                          onChange={(e) => handleTimeInputChange(day, 'startPeriod', e.target.value)}
                          className="w-16 p-1 border rounded"
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Closing Time</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={timeInputs[day]?.endTime}
                          onChange={(e) => handleTimeInputChange(day, 'endTime', e.target.value)}
                          placeholder="07:00"
                          className="w-20 p-1 border rounded"
                        />
                        <select
                          value={timeInputs[day]?.endPeriod}
                          onChange={(e) => handleTimeInputChange(day, 'endPeriod', e.target.value)}
                          className="w-16 p-1 border rounded"
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mb-4 flex items-center space-x-2">
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="form-checkbox" />
            <span>Active</span>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              className="px-4 py-2 bg-gray-300"
              onClick={handleCloseModal}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="px-4 py-2 bg-indigo-500 text-white flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                    viewBox="0 0 24 24"
                  ></svg>
                  Saving...
                </span>
              ) : clinicData ? "Update" : "Add Clinic"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClinicModal;