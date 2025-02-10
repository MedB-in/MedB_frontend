import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import LocationSelector from "../../LocationSelector";

const timeSlots = [
  "Closed",
  "08:00 AM - 12:00 PM",
  "09:00 AM - 07:00 PM",
  "10:00 AM - 06:00 PM",
  "11:00 AM - 08:00 PM",
  "12:00 PM - 09:00 PM",
];

const ClinicModal = ({ isOpen, closeModal, clinicData, onSubmit }) => {
  const [loading, setLoading] = useState(false);

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
    clinicId: null,
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    contact: "",
    email: "",
    website: "",
    clinicPicture: "",
    location: { type: "Point", coordinates: [null, null] },
    openingHours: defaultOpeningHours,
    isActive: true,
  };

  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    if (clinicData) {
      setFormData({
        ...defaultFormData,
        ...clinicData,
        location: clinicData.location || { type: "Point", coordinates: [null, null] },
        openingHours: clinicData.openingHours || defaultOpeningHours,
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [clinicData]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOpeningHoursChange = (day, value) => {
    setFormData((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      closeModal();
      toast.success(clinicData ? "Clinic updated successfully" : "Clinic added successfully");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (lat, lng, address, city, state, country, postalCode) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
      address,
      city,
      state,
      country,
      postalCode,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-[400px] max-h-[90vh] overflow-auto">
        <h3 className="text-xl font-semibold mb-4">
          {clinicData ? "Edit Clinic" : "Add New Clinic"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Clinic Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Select Location</label>
            <LocationSelector onSelect={handleLocationSelect} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Address</label>
            <input type="text" name="address" value={formData.address} className="w-full p-2 border rounded-md" readOnly />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Phone</label>
            <input type="text" name="contact" value={formData.contact} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Website</label>
            <input type="url" name="website" value={formData.website} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Clinic Picture URL</label>
            <input type="text" name="clinicPicture" value={formData.clinicPicture} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>

          {/* Opening Hours */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Opening Hours</label>
            {Object.keys(defaultOpeningHours).map((day) => (
              <div key={day} className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{day}</span>
                <select
                  value={formData.openingHours[day]}
                  onChange={(e) => handleOpeningHoursChange(day, e.target.value)}
                  className="w-40 p-1 border rounded-md"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div className="mb-4 flex items-center space-x-2">
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="form-checkbox" />
            <span>Active</span>
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
              className="px-4 py-2 bg-indigo-500 text-white rounded-md flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" viewBox="0 0 24 24"></svg>
                  Saving...
                </span>
              ) : clinicData ? "Update" : "Add Clinic"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClinicModal;
