const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Create Schema & Model
const contactSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  subject: String,
  message: String
});
const Contact = mongoose.model("Contact", contactSchema);

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// POST route to save form data & send email
app.post("/submit", async (req, res) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;
    const newContact = new Contact({ firstName, lastName, email, subject, message });

    // Save to MongoDB
    await newContact.save();

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL, // Change this if you want user email notifications
      subject: `New Contact Form Submission: ${subject}`,
      text: `You received a message from ${firstName} ${lastName} (${email}):\n\n${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Email Error:", error);
        return res.status(500).json({ error: "Error sending email" });
      }
      res.status(201).json({ message: "✅ Form submitted & email sent!" });
    });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Error saving form data" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
