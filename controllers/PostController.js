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
                return res.status(404).json({message: 'Статья не найдена', error: err})
            }
            res.json(doc)
        }).catch((err) => {
            if(err) {
                return res.status(500).json({message: 'Не удалось вернуть статью', error: err})
            }
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи'
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findByIdAndDelete({_id: postId}).then((doc) => {
            if (!doc) {
                return res.status(404).json({message: 'Статья не найдена', error: err})
            }
            res.json(doc)
        }).catch((err) => {
            if (err) {
                console.log(err);
                    res.status(500).json({
                        message: 'Не удалось удалить статью',eror: err});
            }
        })
        
    }   catch (err) {
            console.log(err);
            res.status(500).json({message: 'Не удалось получить статьи'});
        }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            user: req.userId,
            tags: req.body.tags,
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

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne(
            {
                _id: postId
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
                tags: req.body.tags,
            },
        );

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить статью'
        });
    }
}