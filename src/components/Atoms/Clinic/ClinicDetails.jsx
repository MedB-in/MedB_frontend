const ClinicDetails = ({ clinic, onClose, onApprove, onReject, loading }) => {

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-2xl p-6 rounded-xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-600 hover:text-black text-xl"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-4">{clinic.name}</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><strong>Email:</strong> {clinic.email}</p>
                    <p><strong>Contact:</strong> {clinic.contact}</p>
                    <p><strong>Website:</strong> {clinic.website}</p>
                    <p><strong>Submitted On:</strong> {new Date(clinic.submittedOn).toLocaleDateString()}</p>
                    <p><strong>Address:</strong> {clinic.address}</p>
                    <p><strong>City:</strong> {clinic.city}</p>
                    <p><strong>District:</strong> {clinic.district}</p>
                    <p><strong>State:</strong> {clinic.state}</p>
                    <p><strong>Country:</strong> {clinic.country}</p>
                    <p><strong>Postal Code:</strong> {clinic.postalCode}</p>
                    <p><strong>Reviewed By:</strong> {clinic.reviewedby?.displayName || '-'}</p>
                    <p><strong>Reviewed On:</strong> {clinic.reviewedOn ? new Date(clinic.reviewedOn).toLocaleDateString() : '-'}</p>
                    <p><strong>Approved By:</strong> {clinic.approvedby?.displayName || '-'}</p>
                    <p><strong>Approved On:</strong> {clinic.approvedOn ? new Date(clinic.approvedOn).toLocaleDateString() : '-'}</p>
                    <p><strong>Rejected By:</strong> {clinic.rejectedby?.displayName || '-'}</p>
                    <p><strong>Rejected On:</strong> {clinic.rejectedOn ? new Date(clinic.rejectedOn).toLocaleDateString() : '-'}</p>
                    <p><strong>Approved:</strong> {clinic.isApproved || !clinic.isRejected ? 'Yes' : 'No'}</p>
                    <p><strong>Rejected:</strong> {clinic.isRejected ? 'Yes' : 'No'}</p>
                    {clinic.isRejected && <p><strong>Rejected Reason:</strong> {clinic.rejectedReason}</p>}
                </div>

                {!clinic.isApproved && !clinic.isRejected && (
                    <button
                        onClick={() => onApprove(clinic.registrationId)}
                        className="mt-6 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded mr-10"
                    >
                        {loading ? 'Approving...' : 'Approve Clinic'}
                    </button>
                )}
                {!clinic.isRejected && !clinic.isApproved && (
                    <button
                        onClick={() => onReject(clinic.registrationId)}
                        className="mt-6 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                        disabled={loading}
                    >
                        {loading ? 'Rejecting...' : 'Reject'}
                    </button>
                )}
            </div>
        </div>
    );
}

export default ClinicDetails