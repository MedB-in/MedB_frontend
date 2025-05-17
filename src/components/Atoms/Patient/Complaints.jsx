import RemoveIcon from "../../../assets/images/prescritpion/remove.svg";
import AddIcon from "../../../assets/images/prescritpion/add-icon.svg"; 
const Complaints = () => {
    return (
        <div className="flex flex-col w-full shadow-md rounded-lg pt-1 pb-5 bg-white">
            <div className="bg-[#6F64E7] text-white text-sm font-semibold uppercase rounded-t-lg px-6 py-4">
                <div className="grid grid-cols-[1fr_1fr_40px] items-center gap-4">
                    <div>Problems/Issues</div>
                    <div>Duration</div>
                    <div></div>
                </div>
            </div>
            <div className="px-6 mt-4">
                <div className="grid grid-cols-[1fr_1fr_40px] items-center gap-4">
                    <input
                        type="text"
                        placeholder="Enter Problems/Issues"
                        className="h-[50px] px-4 rounded-md bg-[rgba(134,207,195,0.2)] shadow"
                    />
                    <input
                        type="text"
                        placeholder="Enter Duration"
                        className="h-[50px] px-4 rounded-md bg-[rgba(134,207,195,0.2)] shadow"
                    />
                    <button className="w-6 h-6">
                        <img
                            src={RemoveIcon}
                            alt="Remove"
                            className="w-full h-full"
                        />
                    </button>
                </div>
            </div>
            <button className="flex items-center gap-1 text-sm text-[#6F64E7] font-medium px-6 mt-4">
                <img
                    src={AddIcon}
                    className="w-4 h-4"
                    alt="Add icon"
                />
                <span>Add</span>
            </button>
        </div>
    )
}

export default Complaints