const UserAvatar = ({ user, online = null, profile = false }) => {

    console.log('UserAvatar user:', user);
    let onlineClass = "";
    if (online === true) onlineClass = "avatar-online";
    if (online === false) onlineClass = "avatar-offline";
    
    const sizeClass = profile ? "w-40" : "w-8";

    if (user.avatar_url) {
        return (
            <div className={`chat-image avatar ${onlineClass}`}>
                <div className={`rounded-full ${sizeClass}`}>
                    <img src={user.avatar_url} alt={user.name} />
                </div>
            </div>
        );
    }

    return (
        <div className={`chat-image avatar avatar-placeholder ${onlineClass}`}>
            <div className={`bg-gray-400 text-center text-gray-800 rounded-full ${sizeClass}`}>
                <span className="text-xl">
                    {user.name?.substring(0, 1)}
                </span>
            </div>
        </div>
    );
};

export default UserAvatar;
