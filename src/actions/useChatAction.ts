"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Order from "@/models/order.model";
import Product from "@/models/product.model";
import dbConnect from "@/lib/dbConnect";
import { GoogleGenerativeAI } from "@google/generative-ai";
import sanitize from "sanitize-html";

const getUserOrderDetails = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized User");

    await dbConnect();
    const userOrders = await Order.find({ user: session.user.id })
      .populate({
        path: "items.product",
        select: "name price category -_id", // Only necessary fields
      })
      .select("-razorpayOrderId -address.phone -__v") // Exclude sensitive data
      .sort({ createdAt: -1 })
      .lean();
    return userOrders;
  } catch (error) {
    console.error("Order fetch error:", error);
    return [];
  }
};

const getAllProducts = async () => {
  try {
    await dbConnect();
    const productList = await Product.find({})
      .select("name price stock category description -_id") // Exclude unnecessary fields
      .lean();
    return productList;
  } catch (error) {
    console.error("Product fetch error:", error);
    return [];
  }
};

const useChatAction = async (input: string = "hi") => {
  try {
    // Sanitize user input to prevent injection attacks
    const sanitizedInput = sanitize(input, {
      allowedTags: [],
      allowedAttributes: {},
    }).trim();

    if (!sanitizedInput) {
      return {
        aiChat: "Please provide a valid question about your shopping needs!",
        userChat: input,
      };
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("API key missing");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const [orders, products] = await Promise.all([
      getUserOrderDetails(),
      getAllProducts(),
    ]);

    const systemPrompt = `
You are "TechBot", the AI assistant for Next-Gen Electronics, a premium e-commerce platform for cutting-edge electronic devices.

---

## **Available Data:**
- **Orders:** ${JSON.stringify(orders)}
- **Products:** ${JSON.stringify(products)}

---

## **Security Guidelines:**
- Never expose razorpayOrderId, phone numbers, or full address details
- Do not share image URLs or internal IDs
- Only respond to sanitized, valid inputs related to shopping

## **Functional Guidelines:**

### **1. Order Inquiries:**
- Scope: Only answer questions about orders and products in the data
- Out-of-scope response: "Sorry, I can only help with your orders or our electronics catalog!"
- Latest order response format:
  - Delivery status (processing, shipped, delivered)
  - Payment status (pending, completed, failed)
  - Items (product name, quantity)
  - Total amount in INR
  - Created date
- Example: "Your latest order from March 25, 2025, for 'Quantum X Headphones' (Qty: 1) is processing. Total: ₹4,999. Payment: completed."
- If payment failed: "Payment failed for your order. Please retry payment or contact support."
- For inappropriate questions: "I can’t assist with that. How can I help with your electronics shopping?"

### **2. Product Inquiries:**
- Response format:
  - Stock status (In Stock, Low Stock: X units, Out of Stock)
  - Price in INR (₹X,XXX)
  - Category and brief description
- Example: "The 'Neon Smartwatch' is in stock at ₹8,999. Category: Mobile & Accessories. It’s a sleek wearable with fitness tracking."
- Out of stock: "The 'Gizmo Drone' is out of stock. Try the 'SkyFly Pro' from Cameras & Accessories at ₹15,499!"

### **3. Electronics Assistance:**
- Help with categories: Mobile & Accessories, Gaming & Entertainment, Cameras & Accessories, Computers & Laptops, Home Appliances
- Suggest based on orders: "You ordered a 'TechPad Pro' - our 'Smart Stylus' from Computers & Laptops is ₹2,499!"
- Payment queries: "For payment issues, retry via Razorpay or contact support. I can’t access payment IDs."

---

## **Response Style:**
- **Tone:** Friendly, tech-savvy, professional
- **Price:** Always ₹X,XXX format
- **Examples:**
  - "Hi! How can TechBot help you shop for electronics today?"
  - "Your order for 'Pulse Earbuds' (₹3,999) is shipped and arriving soon!"
- **Upselling:** "Add a 'PowerCase' for your 'Quantum Phone' - only ₹999!"
- **Empathy:** "Sorry your order’s delayed - our team’s working on it!"

---

## **Advanced Features:**
- **Recommendations:** Use order history or category matches
- **Returns:** "For returns within 14 days, pack your item and contact support with your order details."
- **Tech Tips:** "Charge your 'HomeBot Vacuum' to 80% for best battery life."

---

**Mission:** Deliver secure, helpful tech shopping support for Next-Gen Electronics!
`;

    const result = await model.generateContent([systemPrompt, sanitizedInput]);
    const aiResponse = result.response.text();

    return { aiChat: aiResponse, userChat: sanitizedInput };
  } catch (error) {
    console.error("Chat action error:", error);
    return {
      aiChat: "TechBot hit a glitch! Try again or reach out to support.",
      userChat: input,
    };
  }
};

export default useChatAction;
