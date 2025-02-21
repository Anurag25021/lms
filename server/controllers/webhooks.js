import { Webhook } from "svix";
import User from "../models/user.js";

const clerkWebhooks = async (req, res) => {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ success: false, message: "Method Not Allowed" });
        }

        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        const payload = req.rawBody || JSON.stringify(req.body); // Ensure raw body for verification

        whook.verify(payload, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        });

        const { data, type } = req.body;

        switch (type) {
            case "user.created":
                if (!data.email_addresses?.length) {
                    return res.status(400).json({ success: false, message: "Missing email address" });
                }
                await User.create({
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    imageUrl: data.image_url,
                });
                return res.status(201).json({ success: true });

            case "user.updated":
                if (!data.email_addresses?.length) {
                    return res.status(400).json({ success: false, message: "Missing email address" });
                }
                await User.findByIdAndUpdate(data.id, {
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    imageUrl: data.image_url,
                });
                return res.status(200).json({ success: true });

            case "user.deleted":
                await User.findByIdAndDelete(data.id);
                return res.status(200).json({ success: true });

            default:
                return res.status(400).json({ success: false, message: "Invalid event type" });
        }
    } catch (error) {
        console.error("Webhook Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export default clerkWebhooks;
