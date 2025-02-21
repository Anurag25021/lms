import { Webhook } from "svix";
import user from "../models/User.js";

// API controller
export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        });

        const { data, type } = req.body;

        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address, // Fixed property name
                    name: `${data.first_name} ${data.last_name}`,
                    imageUrl: data.image_url, // Fixed property name
                };
                await User.create(userData);
                res.json({});
                break;
            }
            case "user.updated": {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    imageUrl: data.image_url,
                };
                await User.findByIdAndUpdate(data.id, userData);
                 res.json({});
                 break;
            }
            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
                res.json({});
                break;
            }
            default:
            break;
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export default clerkWebhooks;
