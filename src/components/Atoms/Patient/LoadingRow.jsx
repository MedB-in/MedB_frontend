import React from 'react';

const LoadingRow = ({ index, isDoctor }) => {
    return (
        <tr key={index} className={`${index % 2 === 0 ? 'bg-[#f0f0ff]' : 'bg-white'}`}>
            <td className="px-4 py-3 text-left rounded-l-lg">
                <div className="flex justify-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse"></div>
                        <div className="flex-1">
                            <div className="h-5 w-32 bg-gray-300 rounded-md animate-pulse mb-1"></div>
                            <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-4 py-3 text-center">
                <div className="h-5 w-24 bg-gray-300 rounded-md animate-pulse mx-auto"></div>
            </td>
            <td className="px-4 py-3 text-center">
                <div className="h-5 w-24 bg-gray-300 rounded-md animate-pulse mx-auto"></div>
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-4 justify-center">
                    <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse"></div>
                    <div className="h-5 w-32 bg-gray-300 rounded-md animate-pulse"></div>
                </div>
            </td>
            <td className="px-4 py-3 text-center">
                <div className="h-5 w-24 bg-gray-300 rounded-md animate-pulse mx-auto"></div>
            </td>
            <td className="px-4 py-3 text-center rounded-r-lg">
                <div className="h-5 w-24 bg-gray-300 rounded-md animate-pulse mx-auto"></div>
            </td>
            {!isDoctor && (
                <td className="px-4 py-3 text-center rounded-r-lg">
                    <div className="h-5 w-24 bg-gray-300 rounded-md animate-pulse mx-auto"></div>
                </td>
            )}
        </tr>
    );
};

export default LoadingRow;
