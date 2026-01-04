import { Navigate } from "react-router-dom";
import { userAuth } from "./AuthContext";

const ProtectedRouter = ({ children }) => {
    const { userData, loading } = userAuth();

    if (loading) return 

    if (!userData) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRouter;
