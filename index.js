import express from "express";
import mongoose from 'mongoose';

import { registerValidation, loginValidation, postCreateValidation } from "./validations.js";
import checkAuth from "./utils/checkAuth.js";
import { register, login, getMe } from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";

mongoose
.connect('mongodb+srv://thor:LzJbOLlhxdJIhZ5E@cluster9.mddwbhr.mongodb.net/twit-blog?retryWrites=true&w=majority')
.then(() => console.log('DB Ok'))
.catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());

app.post('/auth/login', loginValidation, login);
app.post('/auth/register', registerValidation, register);
app.get('/auth/me', checkAuth, getMe);

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);
// app.delete('/posts', PostController.remove);
// app.patch('/posts', PostController.update);


app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});