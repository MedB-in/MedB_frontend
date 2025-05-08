import { useRef, useState, useLayoutEffect } from "react";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const loadGoogleMapsScript = (callback) => {
    if (typeof window.google === "object" && typeof window.google.maps === "object") {
        callback();
        return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = callback;
    document.head.appendChild(script);
};

const LocationSelector = ({ onSelect }) => {
    const inputRef = useRef(null);
    const [inputValue, setInputValue] = useState("");

    useLayoutEffect(() => {
        loadGoogleMapsScript(() => {
            const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
                types: ["geocode"],
                fields: ["formatted_address", "address_components", "geometry"],
            });

            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                if (!place.geometry) return;

                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                const address = place.formatted_address;

                let city = "", district = "", state = "", country = "", postalCode = "";

                place.address_components.forEach(component => {
                    const types = component.types;

                    if (types.includes("locality")) city = component.long_name;
                    if (types.includes("administrative_area_level_2")) district = component.long_name;
                    if (types.includes("administrative_area_level_1")) state = component.long_name;
                    if (types.includes("country")) country = component.long_name;
                    if (types.includes("postal_code")) postalCode = component.long_name;
                });

                setInputValue(address);
                onSelect(lat, lng, address, city, district, state, country, postalCode);
            });
        });
    }, [onSelect]);

    return (
        <div>
            <input
                ref={inputRef}
                type="text"
                placeholder="Search location"
                className="w-full p-2 gap-1 px-3 py-3.5 bg-white rounded-lg border border-solid border-zinc-300 text-black text-opacity-70"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
        </div>
    );
};

export default LocationSelector;
