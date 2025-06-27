import { Link } from "react-router";

const FriendCard = ({ friend }) => {

    function calculateAge(dateString) {
        if (!dateString) return "N/A";
        const today = new Date();
        const [year, month, day] = dateString.split('-').map(Number);
        const birthDate = new Date(year, month - 1, day);

        let age = today.getFullYear() - birthDate.getFullYear();

        // Adjust if birthday hasn’t occurred yet this year:
        const hasHadBirthdayThisYear =
            today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

        if (!hasHadBirthdayThisYear) {
            age--;
        }

        return age;
    }
    return (
        <div className="card bg-base-200 hover:shadow-md transition-shadow">
            <div className="card-body p-4">
                {/* USER INFO */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="avatar size-12">
                        <img src={friend.image} alt={friend.name} />
                    </div>
                    <h3 className="font-semibold truncate">{friend.name}</h3>
                </div>

                <div className="flex flex-wrap gap-1.5">
                    <span className="badge badge-secondary">
                        Age : {calculateAge(friend.dob)}
                    </span>
                    <span className="badge badge-outline">
                        Gender : {friend.gender}
                    </span>
                </div>

                <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
                    Message
                </Link>
            </div>
        </div>
    );
};
export default FriendCard;

