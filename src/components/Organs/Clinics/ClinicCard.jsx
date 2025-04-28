import React from 'react';
import { motion } from 'framer-motion';

const ClinicCard = ({ clinics, onClinicClick }) => {
    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const groupedHours = [];

    Object.entries(clinics.openingHours || {}).sort((a, b) => daysOrder.indexOf(a[0]) - daysOrder.indexOf(b[0])).forEach(([day, hours]) => {
        const existingGroup = groupedHours.find(group => group.hours === hours);
        if (existingGroup) {
            existingGroup.days.push(day);
        } else {
            groupedHours.push({ days: [day], hours });
        }
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            onClick={() => onClinicClick(clinics.clinicId)}
            className="relative bg-gradient-to-br from-[#c2b2f0] to-[#a28de7] mt-10 p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105 text-center cursor-pointer border border-gray-200 min-h-[400px] flex flex-col justify-between"
        >
            <img
                src={clinics.clinicPicture}
                alt={clinics.clinicName}
                className="absolute w-24 h-24 object-cover rounded-full -top-12 left-1/2 transform -translate-x-1/2 border-4 border-white shadow-md"
            />
            <div className="mt-16">
                <h3 className="bg-white px-4 py-2 rounded-lg inline-block font-bold text-purple-900 capitalize">
                    {clinics.clinicName}
                </h3>
                <p className="text-black capitalize mt-3 text-lg font-medium">Clinic</p>
                <div className="mt-4 text-sm text-black space-y-2">
                    <p className="text-gray-700">📍 {clinics.address}, {clinics.city}, {clinics.state}, {clinics.country} - {clinics.postalCode}</p>
                    <p>📧 {clinics.email}</p>
                    <p>📞 {clinics.clinicContact}</p>
                    {clinics.website && <a href={clinics.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">🌐 Visit Website</a>}
                </div>
            </div>
            <div className="mt-4 text-sm text-left">
                <p className="font-semibold mb-1">🕰 Opening Hours:</p>
                {groupedHours.map((group, index) => (
                    <p key={index}>{group.days.join(', ')}: {group.hours}</p>
                ))}
            </div>
        </motion.div>
    );
};

export default ClinicCard;