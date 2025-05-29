const TermsModal = ({ onClose, onAccept }) => {
    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl">
                <h2 className="text-xl font-semibold mb-4">Terms and Conditions</h2>
                <div className="text-sm text-gray-700 max-h-60 overflow-y-auto mb-4">
                    <p>
                        Welcome to MedB! By registering your clinic, you agree to our usage policy,
                        data storage practices, and our terms of service. Please ensure you follow all
                        legal regulations and provide accurate data.
                    </p>
                    <ul className="list-disc list-inside mt-2">
                        <li>Data will be stored securely.</li>
                        <li>You are responsible for maintaining your credentials.</li>
                        <li>No misuse of platform services will be tolerated.</li>
                    </ul>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onClose} className="text-gray-600 px-4 py-2 rounded hover:bg-gray-100">
                        Close
                    </button>
                    <button
                        onClick={onAccept}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsModal;
