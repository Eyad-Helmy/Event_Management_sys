const express = require("express");
const app = express();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server Is Running");
})