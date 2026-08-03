import { jwtDecode } from "jwt-decode";

export const getCurrentUser = () => {
    const token = localStorage.getItem("token");

    if (!token) return null;

    try {
        const decoded = jwtDecode(token);

        return {
            username: decoded.sub,
            role: decoded.role
        };
    } catch (error) {
        return null;
    }
};