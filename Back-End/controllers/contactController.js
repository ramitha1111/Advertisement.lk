const Message = require("../models/contact");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Send Message (POST /api/contact)
exports.sendMessage = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    try {
        // Save message to database
        const newMessage = new Message({ name, email, message });
        await newMessage.save();

        // Send email notification (optional)
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS, // Your email password or app password
            },
        });

        let mailOptions = {
            from: email,
            to: process.env.RECEIVER_EMAIL, // Admin email
            subject: "New Contact Form Submission",
            text: `From: ${name} (${email})\nMessage:\n${message}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Message sent successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error, try again later." });
    }
};

// Get All Messages (GET /api/contact)
exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not retrieve messages." });
    }
};


// Get message by ID   GET /api/contact/:id
exports.getMessageById = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Delete Message (DELETE /api/contact/:id)
exports.deleteMessage = async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Message deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not delete message." });
    }
};
