import { useState } from "react";
import Button from "../../../components/Atoms/Login/Button";
import Complaints from "../../../components/Atoms/Patient/Complaints";
import CardComponent from "../../../components/Organs/Patient/CardComponent";
import Medicines from "../../../components/Organs/Patient/Medicines";
import PatientHeader from "../../../components/Organs/Patient/PatientHeader";
import TextAreaCard from "../../../components/Atoms/Patient/TextAreaCard";

const PrescriptionPage = () => {
    const [reason, setReason] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [notes, setNotes] = useState("");

    return (
        <div className="p-6 w-full">
            <div className="flex w-full flex-col items-stretch">
                <div className="flex flex-col items-stretch mt-2 max-md:max-w-full">
                    <div className="flex gap-5 max-md:flex-col">
                        <div className="text-xs min-w-[20%] max-w-[20%] text-black font-normal whitespace-nowrap">
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
                        </div>
                        <div className="w-full">
                            <PatientHeader />
                            <div className="mt-5">
                                <Complaints />
                            </div>
                            <div className="mt-5">
                                <Medicines />
                            </div>
                            <div className="flex flex-col justify-end py-2 mt-4 sm:flex-row gap-4">
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
                            </div>
                            <div className="w-full mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <TextAreaCard
                                        label="Reason For Visit"
                                        placeholder="Enter reason for visit"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
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
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 mt-12">
                                <Button variant="secondary" onClick={() => { }}>
                                    Clear
                                </Button>
                                <Button variant="primary" onClick={() => { }}>
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
};

export default PrescriptionPage