import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Main() {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div>
            <h1>Main Protected Page</h1>
            <p>You are logged in 🎉</p>

            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}