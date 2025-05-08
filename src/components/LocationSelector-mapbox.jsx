import { useState, useEffect } from "react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const LocationSelector = ({ onSelect }) => {
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        const geocoder = new MapboxGeocoder({
            accessToken: MAPBOX_ACCESS_TOKEN,
            types: "place,postcode,address",
            placeholder: "Search location",
            marker: false,
        });

        geocoder.on("result", (e) => {
            const place = e.result;
            const [lng, lat] = place.center;

            let addressParts = place.place_name.split(",");
            let address = "", city = "", district = "", state = "", country = "", postalCode = "";

            place.context?.forEach((context) => {
                if (context.id.includes("place")) city = context.text;
                if (context.id.includes("district") || context.id.includes("locality")) district = context.text;
                if (context.id.includes("region")) state = context.text;
                if (context.id.includes("country")) country = context.text;
                if (context.id.includes("postcode")) postalCode = context.text;
            });

            let cityIndex = addressParts.findIndex(part => part.trim() === city);
            if (cityIndex !== -1) {
                address = addressParts.slice(0, cityIndex).join(", ").trim();
            } else {
                address = addressParts[0]?.trim();
            }

            address = address.replace(/\b\d{5,6}\b/g, "").replace(/,\s*,/g, ",").replace(/(^,|,$)/g, "").trim();

            setInputValue(address);

            onSelect(lat, lng, address, city, district, state, country, postalCode);
        });

        const geocoderContainer = document.getElementById("geocoder");
        if (geocoderContainer) {
            geocoderContainer.appendChild(geocoder.onAdd());
        }

        return () => {
            geocoder.onRemove();
        };
    }, [onSelect]);

    return (
        <div>
            <div id="geocoder" className="w-full"></div>
            <input
                type="text"
                className="w-full p-2 gap-1 px-3 py-3.5 bg-white rounded-lg border border-solid border-zinc-300 text-black text-opacity-70 mt-2"
                value={inputValue}
                readOnly
            />
        </div>
    );
};

export default LocationSelector;