const express = require("express");
const app = express();
const cors = require("cors")

//Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const venueRoutes = require("./routes/venueRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const bookingRoutes = require('./routes/bookingRoutes');

app.use(cors({
    origin: '*',
    credentials: true
  }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server Is Running");
    console.log(PORT)
});