import {ReturnDocument} from 'mongodb';
import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndUpdate({_id: postId}, {$inc: {views: 1}}, {ReturnDocument: 'after'}).then((doc) => {
            if(!doc) {
                return res.status(404).json({message: 'Не удалось вернуть статью', error: err})
            }
            res.json(doc)
        }).catch((err) => {
            if(err) {
                return res.status(403).json({message: 'Статья не найдена', error: err})
            }
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи'
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        }) 

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью'
        });
    }
};