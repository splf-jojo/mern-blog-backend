import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import { PORT } from "./config.js";
import { validationResult } from 'express-validator'

import { registerValidation, loginValidation, postCreateValidation } from "./validtaions/auth.js";
import UserModel from "./models/User.js";

import { UserController, PostController } from "./Controllers/index.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";


mongoose
    .connect('mongodb+srv://adventurejojo28:xzntTxmdC6HvTg2P@cluster0.jwdwyuh.mongodb.net/messenger?retryWrites=true&w=majority')
    .then(() => { console.log("db ok") })
    .catch((err) => { console.log("db err", err) });


const app = express();
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });


app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send("hello www");
});



app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});
app.get('/tags', PostController.getLastTags);

app.get('/posts/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create); //MongoServerError: E11000 duplicate key error collection: messenger.posts index: text_1 dup key: { text: "dssdf js" }
app.delete('/post/:id', checkAuth, PostController.remove);
app.patch('/post/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.listen(PORT, (err) => {
    if (err) {
        console.error(err);
    }
    console.log(`Server running on port ${PORT}`);
}); 