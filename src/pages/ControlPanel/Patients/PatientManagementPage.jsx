import { useState } from "react";
import PatientModal from "../../../components/Organs/Patient/PatientModal";
import toast from "react-hot-toast";
import { getPatients } from "../../../services/clinics";

const PatientManagement = () => {
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const clinicId = userDetails?.clinicId;

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [patientQuery, setPatientQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState(false);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);

  const handleSearchPatient = async () => {
    if (!patientQuery.trim()) {
      toast.error("Please enter email or contact number.");
      return;
    }
    try {
      setLoading(true);
      setSearchQuery(true);
      const response = await getPatients(patientQuery);
      setPatients(response.data.patients || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch patient details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = (newPatient) => {
    setPatients((prevPatients) => [...prevPatients, newPatient]);
    setShowModal(false);
  };

  const handleUpdatePatient = (patient) => {
    setSelectedPatient(patient);
    setIsUpdate(true);
    setShowModal(true);
  };

  const handleUpdatePatientData = (updatedPatient) => {
    setPatients((prevPatients) =>
      prevPatients.map((patient) => (patient.userId === updatedPatient.userId ? updatedPatient : patient))
    );
    setShowModal(false);
  };

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
      <label className="block text-gray-700 font-semibold mb-2">Enter Patient Details:</label>
      <div className="flex gap-3">
        <input
          type="text"
          value={patientQuery}
          onChange={(e) => setPatientQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearchPatient()}
          placeholder="Enter First Name, Last Name, Email or Contact Number"
          className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-400"
        />
        <button onClick={handleSearchPatient} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
          Search
        </button>
      </div>
      {loading ? (
        <p className="mt-2 text-gray-500">Loading...</p>
      ) : searchQuery && patients.length === 0 ? (
        <p className="mt-2 text-gray-500">No patients found.</p>
      ) : patients.length > 0 && (
        <div className="mt-4 bg-white p-2 rounded-lg border border-gray-200">
          {patients.map((patient, index) => (
            <div
              key={index}
              className={`flex justify-between items-center p-3 mb-3 cursor-pointer transition duration-300 rounded-md hover:bg-gray-100 ${selectedPatient?.userId === patient.userId ? "bg-blue-100 border-l-4 border-blue-500" : "border-l-4 bg-gray-50"
                }`}
              onClick={() => setSelectedPatient(patient)}
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-800 capitalize">
                  {patient.firstName} {patient.middleName ? ` ${patient.middleName}` : ''} {patient.lastName || ''}
                </p>
                <p className="text-sm text-gray-600">{patient.contactNo || "Contact Not Available"} • {patient.email}</p>
              </div>
              <button
                onClick={(e) => { handleUpdatePatient(patient) }}
                className="text-blue-500 hover:underline"
              >
                Update Patient
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6">
        <button onClick={() => { setShowModal(true); setIsUpdate(false); }} className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition">
          Add New Patient
        </button>
      </div>
      {showModal && <PatientModal onClose={() => setShowModal(false)} onPatientAdded={handleAddPatient} onPatientUpdated={handleUpdatePatientData} clinicId={clinicId} patient={isUpdate ? selectedPatient : null} isUpdate={isUpdate} />}
    </div>
  );
};


export default PatientManagement;