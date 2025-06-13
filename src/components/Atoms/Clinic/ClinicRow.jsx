
const ClinicRow = ({ clinic, toggleDetails }) => {
    return (
        <tr className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
            onClick={() => toggleDetails(clinic.registrationId)}>
            <td className="px-6 py-4 text-sm text-gray-800">{clinic.name}</td>
            <td className="px-6 py-4 text-sm text-gray-800">{clinic.email}</td>
            <td className="px-6 py-4 text-sm text-gray-800">{clinic.contact}</td>
            <td className="px-6 py-4 text-sm text-gray-800">{clinic.city}</td>
            <td className="px-6 py-4 text-sm text-gray-800">
                {clinic.isApproved ? (
                    <span className="text-green-600 font-medium">Approved</span>
                ) : clinic.isRejected ? (
                    <span className="text-red-600 font-medium">Rejected</span>
                ) : clinic.reviewedBy ? (
                    <span className="text-yellow-600 font-medium">Review Done</span>
                ) : (
                    <span className="text-gray-500 italic">Waiting for Approval{clinic?.isReApplied ? <span className="text-red-600 font-medium"> (Re-Applied)</span> : ""}</span>
                )}
            </td>
        </tr>
    );
};

export default ClinicRow;
