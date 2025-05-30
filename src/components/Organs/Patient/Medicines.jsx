import StarIcon from "../../../assets/images/prescritpion/star-icon.svg";
import RemoveMedIcon from "../../../assets/images/prescritpion/remove-med-icon.svg";
import AddIcon from "../../../assets/images/prescritpion/add-med.svg";
const Medicines = () => {
    return (
        <div className="flex flex-col w-full shadow-md rounded-lg pt-1 pb-5 bg-white">
            <div className="bg-[#6F64E7] text-white text-sm font-semibold uppercase rounded-t-lg px-6 py-4">
                <div className="grid grid-cols-[1fr_120px_120px_120px_1fr_40px] items-center gap-4">
                    <div>Medicine</div>
                    <div>Dosage</div>
                    <div>Frequency</div>
                    <div>Duration</div>
                    <div>Remarks</div>
                    <div></div>
                </div>
            </div>

            <div className="px-6 mt-4">
                <div className="grid grid-cols-[1fr_120px_120px_120px_1fr_40px] items-center gap-4">
                    <div className="flex items-center gap-2">
                        <img
                            src={StarIcon}
                            className="w-5 h-5"
                            alt="Medicine icon"
                        />
                        <input
                            type="text"
                            placeholder="Medicine name"
                            className="w-full px-3 py-2 rounded-md border bg-[rgba(134,207,195,0.2)] border-gray-300"
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Dosage"
                        className="px-3 py-2 rounded-md border bg-[rgba(134,207,195,0.2)] border-gray-300"
                    />
                    <input
                        type="text"
                        placeholder="Frequency"
                        className="px-3 py-2 rounded-md border bg-[rgba(134,207,195,0.2)] border-gray-300"
                    />
                    <input
                        type="text"
                        placeholder="Duration"
                        className="px-3 py-2 rounded-md border bg-[rgba(134,207,195,0.2)] border-gray-300"
                    />
                    <input
                        type="text"
                        placeholder="Remarks"
                        className="w-full px-3 py-2 rounded-md border bg-[rgba(134,207,195,0.2)] border-gray-300"
                    />

                    <button className="w-6 h-6">
                        <img
                            src={RemoveMedIcon}
                            alt="Remove"
                            className="w-full h-full"
                        />
                    </button>
                </div>
            </div>
            <button className="flex items-center gap-1 text-xs text-white font-medium bg-[#86CFC3] rounded-md px-3 py-1 mt-4 ml-6 w-fit shadow-inner">
                <img
                    src={AddIcon}
                    className="w-3 h-3"
                    alt="Add icon"
                />
                <span>Add Medicine</span>
            </button>
        </div>
    )
};

export default Medicines