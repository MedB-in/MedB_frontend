import React from "react";

const MenuDetails = ({ rights }) => {
    // if (!rights) return <div className="p-4">Select a menu to see details</div>;
console.log(rights);

    return (
        <div className="p-4 border rounded-lg shadow-lg bg-red-600">
            <h2 className="text-lg font-semibold mb-2">Menu Rights</h2>
            <ul className="list-disc pl-4">
                <li>Create Allowed: {rights?.createAllowed ? "✅ Yes" : "❌ No"}</li>
                <li>Edit Allowed: {rights?.editAllowed ? "✅ Yes" : "❌ No"}</li>
                <li>Delete Allowed: {rights?.deleteAllowed ? "✅ Yes" : "❌ No"}</li>
                <li>View Allowed: {rights?.viewAllowed ? "✅ Yes" : "❌ No"}</li>
            </ul>
            <section className="flex flex-col items-center pt-20 justify-center h-screen text-center">
                <h1 className="text-2xl font-bold">Welcome!</h1>
                <p className="text-lg">Select a category from the left menu and proceed.</p>
            </section>
        </div>
    );
};

export default MenuDetails;
