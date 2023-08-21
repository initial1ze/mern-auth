import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import { PORT } from './constants.js';
import userRoutes from './routes/user.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
    res.json({ message: "Welcome to the application." });
});

app.use("/auth/", userRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/mern-auth", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to MongoDB.");
}).catch(err => {
    console.error("Connection error", err);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
