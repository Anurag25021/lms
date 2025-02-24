import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/purchase.js";
import Course from "../models/course.js";

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

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = Stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        const session = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        if (!session.data.length) {
          console.error(`No session found for payment intent: ${paymentIntentId}`);
          return res.status(400).json({ error: 'Invalid session data' });
        }

        const { purchaseId } = session.data[0].metadata;
        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) return res.status(404).json({ error: 'Purchase not found' });

        const userData = await User.findById(purchaseData.userId);
        if (!userData) return res.status(404).json({ error: 'User not found' });

        const courseData = await Course.findById(purchaseData.courseId.toString());
        if (!courseData) return res.status(404).json({ error: 'Course not found' });

        courseData.enrolledStudents.push(userData._id);
        await courseData.save();

        userData.enrolledCourses.push(courseData._id);
        await userData.save();

        purchaseData.status = 'completed';
        await purchaseData.save();
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        const session = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        if (!session.data.length) {
          console.error(`No session found for failed payment intent: ${paymentIntentId}`);
          return res.status(400).json({ error: 'Invalid session data' });
        }

        const { purchaseId } = session.data[0].metadata;
        const purchaseData = await Purchase.findById(purchaseId);
        if (purchaseData) {
          purchaseData.status = 'failed';
          await purchaseData.save();
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error(`Error handling webhook event: ${error.message}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  res.json({ received: true });
};

export default stripeWebhooks;
