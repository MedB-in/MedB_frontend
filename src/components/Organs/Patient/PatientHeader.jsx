import CountdownTimer from "../../Atoms/Patient/CountdownTimer";
import HistoryIcon from "../../../assets/images/prescritpion/history-icon.svg";
const PatientHeader = () => {

    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB").split("/").join("-");

    return (
        <div className="border border-black/30 rounded-2xl px-6 py-4">
            <div className="flex flex-wrap justify-between gap-8">
                <div className="flex flex-1 items-center gap-6 min-w-[300px]">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-[120px] h-[120px] rounded-full border-2 border-black overflow-hidden">
                            <img
                                src="https://cdn.builder.io/api/v1/image/assets/5b3dcd49534d4347b884c3044b5a5e9a/c391c413b6da17d09852404fe3b25cc14ac16b5e?placeholderIfAbsent=true"
                                alt="Patient"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="text-black text-lg font-semibold text-center">
                            Mr. Sumith
                        </div>
                    </div>

                    <div className="flex flex-col justify-center gap-4 flex-1 min-w-[280px]">
                        <div className="bg-[rgba(134,207,195,0.2)] rounded-xl p-4 grid grid-cols-2 gap-y-3 text-sm text-black">
                            <div className="font-normal">OP Number</div>
                            <div className="font-medium">: 125</div>
                            <div className="font-normal">Age/Sex</div>
                            <div className="font-medium">: 28 Year/M</div>
                            <div className="font-normal">Patient ID</div>
                            <div className="font-medium">: 021547</div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center gap-6 items-end min-w-[250px]">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center gap-4">
                            <CountdownTimer
                                initialMinutes={5}
                                initialSeconds={30}
                                onComplete={() => console.log("Normalized timer completed!")}
                            />
                            <div className="bg-gray-100 text-gray-600 font-bold text-md px-2 py-1 rounded-md whitespace-nowrap">
                                {formattedDate}
                            </div>
                        </div>
                        <div className="text-sm text-center text-black leading-tight">
                            Previous<br />History
                            <div className="bg-white shadow-md p-2 rounded-md w-[66px] h-[66px] flex items-center justify-center">
                                <img
                                    src={HistoryIcon}
                                    alt="Data Icon"
                                    className="w-[54px] object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PatientHeader;
