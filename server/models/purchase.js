import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    courseId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Course", 
        required: true,
        index: true  // 🔹 Optimizing queries based on course
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true,
        index: true  // 🔹 Optimizing queries based on user
    },
    amount: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ["pending", "completed", "failed"], 
        default: "pending" 
    }
}, { timestamps: true });

export const Purchase = mongoose.model("Purchase", purchaseSchema);
