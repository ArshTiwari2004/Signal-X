const express = require("express");
const cors = require("cors");
const smsRoutes = require("./routes/smsRoutes");
const connectDB = require("./config/db");
const incidentRoutes = require("./routes/incidentRoutes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
connectDB(); // Connect to MongoDB
app.use('/uploads', express.static('uploads'));

app.use("/api", smsRoutes); // API route for Twilio SMS
app.use("/api/auth", require("./routes/authRoutes"));
app.use('/api', incidentRoutes); // API route for incident reporting

const PORT = process.env.PORT || 5000;
app.listen(PORT , '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
