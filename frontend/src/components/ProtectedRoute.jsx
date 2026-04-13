import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("access");

    console.log("TOKEN:", token);

    if (!token) {
        console.log("REDIRECTING...");
        return <Navigate to="/login" replace />;
    }

    return children;
}