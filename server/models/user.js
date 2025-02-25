import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true }, // 🔹 Keep as String if using external IDs (e.g., Clerk)
        name: { type: String, required: true },
        email: { 
            type: String, 
            required: true, 
            unique: true, // 🔹 Prevent duplicate users
            index: true   // 🔹 Optimize email-based lookups
        },
        imageUrl: { type: String, required: true },
        enrolledCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            },
        ],
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
