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
            className="relative md:mt-10 bg-[#c2b2f0] p-4 rounded-xl shadow-lg transition-transform transform hover:scale-105 text-center cursor-pointer border border-gray-200 sm:w-[260px] sm:h-[200px] w-full max-w-[95vw] h-[140px] flex flex-col sm:flex-col justify-center items-center"
            onClick={() => onSelect(doctor.doctorId)}
        >
            <div className="flex sm:hidden flex-row items-center w-full h-full">
                <div className="flex-shrink-0 mr-4">
                    <ProfileAvatar imageUrl={doctor.profilePicture} name={doctor.firstName} size="w-20 h-20" />
                </div>
                <div className="flex flex-col justify-center text-left flex-grow overflow-hidden">
                    <h3 className="font-bold text-purple-900 capitalize text-lg truncate">
                        Dr. {doctor.firstName} {doctor.middleName} {doctor.lastName}
                    </h3>
                    <p className="text-black capitalize text-sm">{doctor.speciality}</p>
                    <p className="text-black text-xs capitalize">{doctor.qualifications}</p>
                    <p className="text-black text-xs">Exp: {doctor.experience} yrs</p>
                </div>
            </div>

            <div className="hidden sm:flex flex-col items-center justify-center">
                <div className="absolute rounded-full -top-12 left-1/2 transform -translate-x-1/2 border-4 border-white shadow-md">
                    <ProfileAvatar imageUrl={doctor.profilePicture} name={doctor.firstName} size="w-24 h-24" />
                </div>
                <div className="mt-12">
                    <h3 className="font-bold text-purple-900 capitalize text-base truncate max-w-[250px]">
                        Dr. {doctor.firstName} {doctor.middleName} {doctor.lastName}
                    </h3>
                    <p className="text-black mt-2 text-sm capitalize">{doctor.speciality}</p>
                    <p className="text-black text-xs capitalize">{doctor.qualifications}</p>
                    <p className="text-black text-xs">Exp: {doctor.experience} yrs</p>
                </div>
            </div>
        </div>
    );
};

export default DoctorCard;