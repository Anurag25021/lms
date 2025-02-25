import { clerkClient } from "@clerk/express";

const protectEducator = async (req, res, next) => {
    try {
        const userId = req.auth?.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: No user ID provided" });
        }

        const user = await clerkClient.users.getUser(userId);
        
        if (!user?.publicMetadata?.role || user.publicMetadata.role !== "educator") {
            return res.status(403).json({ success: false, message: "Forbidden: Educator access required" });
        }

        next();
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

export default protectEducator;
