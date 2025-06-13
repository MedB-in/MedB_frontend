const ProfileAvatar = ({ imageUrl, name, size = "w-12 h-12" }) => {
    const initial = name?.charAt(0)?.toUpperCase() || "?";

    return (
        <>
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={name}
                    className={`${size} rounded-full object-cover border border-gray-300 shadow-md`}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />
            ) : null}
            <div
                style={{ display: imageUrl ? 'none' : 'flex' }}
                className={`${size} rounded-full bg-gray-300 text-gray-700 font-bold flex items-center justify-center text-lg border border-gray-300 shadow-md`}
            >
                {initial}
            </div>
        </>
    );
};

export default ProfileAvatar;
