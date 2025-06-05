const UserRightsSkeleton = () => {
    return (
        <div className="overflow-x-auto rounded-2xl shadow-lg backdrop-blur-md bg-white/60 ring-1 ring-gray-200">
            <table className="min-w-full text-sm text-gray-800">
                <thead className="bg-white/70 backdrop-blur text-xs uppercase text-gray-500">
                    <tr>
                        <th className="px-4 py-3 text-center">No.</th>
                        <th className="px-4 py-3 text-left">User</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Phone</th>
                        <th className="px-4 py-3 text-left">Clinic</th>
                        <th className="px-4 py-3 text-left">Module / Menu</th>
                        <th className="px-4 py-3 text-left">Rights</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <tr
                            key={index}
                            className="odd:bg-white/50 even:bg-white/30 animate-pulse"
                        >
                            <td className="px-4 py-3 text-center">
                                <div className="w-5 h-5 bg-gray-300 rounded"></div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                                    <div className="w-24 h-4 bg-gray-300 rounded"></div>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="w-32 h-4 bg-gray-300 rounded"></div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="w-24 h-4 bg-gray-300 rounded"></div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-lg bg-gray-300"></div>
                                    <div className="flex flex-col gap-1">
                                        <div className="w-28 h-4 bg-gray-300 rounded"></div>
                                        <div className="w-32 h-3 bg-gray-200 rounded"></div>
                                        <div className="w-24 h-3 bg-gray-200 rounded"></div>
                                        <div className="w-20 h-3 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex flex-col gap-2">
                                    <div className="w-28 h-4 bg-gray-300 rounded"></div>
                                    <div className="w-24 h-3 bg-gray-200 rounded ml-6"></div>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-2">
                                    {["View", "Create", "Edit", "Delete"].map((right, i) => (
                                        <div
                                            key={i}
                                            className="w-14 h-5 bg-gray-300 rounded-full"
                                        ></div>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserRightsSkeleton