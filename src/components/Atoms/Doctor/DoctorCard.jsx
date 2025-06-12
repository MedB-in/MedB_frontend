import DefaultImage from '../../../assets/images/default-doctor.png';
import ProfileAvatar from '../ProfileAvatar';

const DoctorCard = ({ doctor, onSelect, loading }) => {
    if (loading) {
        return (
            <div
                className="relative bg-gray-200 p-6 rounded-xl shadow-lg animate-pulse text-center border border-gray-300 h-[260px] w-[260px] mt-16 flex flex-col items-center justify-center"
            >
                <div className="absolute w-24 h-24 bg-gray-300 rounded-full -top-12 left-1/2 transform -translate-x-1/2 border-4 border-white shadow-md"></div>
                <div className="mt-12 space-y-3 w-full flex flex-col items-center">
                    <div className="bg-gray-300 h-6 w-3/4 rounded"></div>
                    <div className="bg-gray-300 h-5 w-2/3 rounded"></div>
                    <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
                    <div className="bg-gray-300 h-4 w-1/3 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative bg-[#c2b2f0] p-6 mt-8 h-[260px] w-[260px] rounded-xl shadow-lg transition-transform transform hover:scale-105 text-center cursor-pointer border border-gray-200"
            onClick={() => onSelect(doctor.doctorId)}
        >
            <div
                className="absolute rounded-full -top-12 left-1/2 transform -translate-x-1/2 border-4"
            >
                <ProfileAvatar imageUrl={doctor.profilePicture} name={doctor.firstName} size="w-24 h-24" />
            </div>

            <div className="mt-12">
                <h3 className="bg-white px-4 py-2 rounded-lg inline-block font-bold text-purple-900 capitalize">Dr. {doctor.firstName} {doctor.middleName} {doctor.lastName}</h3>
                <p className="text-black capitalize mt-5 text-lg font-medium">{doctor.speciality}</p>
                <p className="text-black text-sm">{doctor.qualifications}</p>
                <p className="text-black text-sm">Experience: {doctor.experience} years</p>
            </div>
        </div>
    );
};

export default DoctorCard;