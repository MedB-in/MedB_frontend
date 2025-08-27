const BookingName = ({ bookFor, patientFirstName, patientMiddleName, patientLastName }) => {
    return (
        <p className="text-lg font-semibold text-gray-800 capitalize">
            {bookFor
                ? bookFor
                : `${patientFirstName || ""} ${patientMiddleName || ""} ${patientLastName || ""}`
            }
        </p>
    );
};

export default BookingName;
