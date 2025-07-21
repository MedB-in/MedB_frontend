import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import BackButton from "../../../components/Atoms/BackButton";
import Button from "../../../components/Atoms/Login/Button";
import Complaints from "../../../components/Atoms/Patient/Complaints";
import TextAreaCard from "../../../components/Atoms/Patient/TextAreaCard";
import CardComponent from "../../../components/Organs/Patient/CardComponent";
import Medicines from "../../../components/Organs/Patient/Medicines";
import PatientHeader from "../../../components/Organs/Patient/PatientHeader";
import { getPrescriptionData, postPrescriptionData, markAppointmentCompleted } from "../../../services/patient";


const PrescriptionPage = () => {
    const { patientId, doctorId, clinicId, appointmentId, appointmentDate, appointmentStatus } = useParams();

    const today = new Date();
    const todayString = today.toLocaleDateString('en-GB');
    const formattedAppointmentDate = appointmentDate.replace(/-/g, '/');
    const isToday = formattedAppointmentDate === todayString;
    const isAllowed = appointmentStatus === "Scheduled";

    const navigate = useNavigate();

    const [diagnosis, setDiagnosis] = useState("");
    const [notes, setNotes] = useState("");
    const [slotGap, setSlotGap] = useState(0);
    const [healthFiles, setHealthFiles] = useState([]);
    const [patient, setPatient] = useState("");
    const [reasonForVisit, setReasonForVisit] = useState("");
    const [medicinesData, setMedicinesData] = useState([{
        medicineName: "",
        dosage: "",
        frequency: "",
        duration: "",
        remarks: ""
    }
    ]);
    const [complaints, setComplaints] = useState([
        { problem: "", duration: "" },
    ]);

    const handleClearData = () => {
        setDiagnosis("");
        setNotes("");
        setMedicinesData([{
            medicineName: "",
            dosage: "",
            frequency: "",
            duration: "",
            remarks: ""
        }
        ]);
        setComplaints([{ problem: "", duration: "" }]);
    }

    const handleMedicinesChange = (updatedMeds) => {
        setMedicinesData(updatedMeds);
    };

    useEffect(() => {
        if (appointmentId) {
            fetchPrescriptionData();
        }
    }, [appointmentId]);

    const fetchPrescriptionData = async () => {
        try {
            const response = await getPrescriptionData(appointmentId);
            setSlotGap(response.data.slotGap);
            setPatient(response.data.patientDetails);
            setReasonForVisit(response.data.reasonForVisit);
            setHealthFiles(response.data.healthFiles);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong.");
        }
    };

    const handleSubmit = async () => {
        const isAnyFieldFilled = (med) =>
            med.medicineName || med.dosage || med.frequency || med.duration || med.remarks;

        const isFullyFilled = (med) =>
            med.medicineName && med.dosage && med.frequency && med.duration;

        const hasPartialMed = medicinesData.some(
            (med) => isAnyFieldFilled(med) && !isFullyFilled(med)
        );

        const validMeds = medicinesData.filter(isFullyFilled);

        if (hasPartialMed) {
            toast.error("Incomplete prescription. Please fill all required fields.");
            return;
        }

        if (medicinesData.length === 1 && validMeds.length === 0) {
            const result = await Swal.fire({
                title: "No medicines added?",
                text: "This will mark the appointment as completed without any Medicine.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, mark as completed",
            });

            if (result.isConfirmed) {
                try {
                    await markAppointmentCompleted(appointmentId, { complaints, notes, diagnosis });
                    toast.success("Appointment marked as completed");
                    navigate('/app/appointments');
                } catch (error) {
                    toast.error(error.response?.data?.message || "Something went wrong.");
                }
            }
            return;
        }

        if (validMeds.length > 0) {
            const result = await Swal.fire({
                title: "Save prescription?",
                text: "Once saved, you won't be able to edit it.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, save it!",
            });

            if (result.isConfirmed) {
                try {
                    await postPrescriptionData(appointmentId, {
                        medicines: validMeds,
                        complaints,
                        notes,
                        diagnosis
                    });
                    toast.success("Prescription saved successfully");
                    navigate('/app/appointments');
                } catch (error) {
                    toast.error(error.response?.data?.message || "Something went wrong.");
                }
            }
        }
    };

    return (
        <div className="p-6 w-full">
            <BackButton />
            <div className="flex w-full flex-col items-stretch">
                <div className="flex flex-col items-stretch mt-2 max-md:max-w-full">
                    <div className="flex gap-5 max-md:flex-col">
                        {/* <div className="text-xs min-w-[20%] max-w-[20%] text-black font-normal whitespace-nowrap">
                            <CardComponent title="Referred by">
                                <p>Test.</p>
                                <p>test test</p>
                                <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    View Details
                                </button>
                            </CardComponent>
                            <CardComponent title="Symptoms">
                                <p>Test.</p>
                                <p>test test</p>
                                <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    View Details
                                </button>
                            </CardComponent>
                            <CardComponent title="Health Files">
                                <p>Test.</p>
                                <p>test test</p>
                                <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    View Details
                                </button>
                            </CardComponent>
                            <CardComponent title="Vitals">
                                <p>Test.</p>
                                <p>test test</p>
                                <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    View Details
                                </button>
                            </CardComponent>
                        </div> */}
                        <div className="w-full">
                            <PatientHeader timer={slotGap} patient={patient} isAllowed={isAllowed} isToday={isToday} healthFiles={healthFiles} />

                            {isToday && isAllowed && (
                                <>
                                    <div className="mt-5">
                                        <Complaints complaints={complaints} setComplaints={setComplaints} />
                                    </div>
                                    <div className="mt-5">
                                        <Medicines medicinesData={medicinesData} setMedicinesData={setMedicinesData} onChange={handleMedicinesChange} />
                                    </div>
                                </>
                            )}
                            {/* <div className="flex flex-col justify-end py-2 mt-4 sm:flex-row gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="nextReview" className="mb-1 text-sm font-medium text-gray-700">
                                        Next Review
                                    </label>
                                    <input
                                        type="date"
                                        id="nextReview"
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="referr" className="mb-1 text-sm font-medium text-gray-700">
                                        Refer
                                    </label>
                                    <input
                                        type="text"
                                        id="referr"
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter details"
                                    />
                                </div>
                            </div> */}
                            <div className="w-full mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <TextAreaCard
                                        label="Reason For Visit"
                                        placeholder="Enter reason for visit"
                                        value={reasonForVisit}
                                        disabled
                                    />
                                    {isToday && isAllowed && (
                                        <>
                                            <TextAreaCard
                                                label="Diagnosis"
                                                placeholder="Enter diagnosis"
                                                value={diagnosis}
                                                onChange={(e) => setDiagnosis(e.target.value)}
                                            />
                                            <TextAreaCard
                                                label="Special Notes"
                                                placeholder="Enter special notes"
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                            {isToday && isAllowed && (
                                <div className="flex justify-end gap-4 mt-12">
                                    <Button variant="secondary" onClick={handleClearData}>
                                        Clear
                                    </Button>
                                    <Button variant="primary" onClick={handleSubmit}>
                                        Submit
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
};

export default PrescriptionPage