import PostModel from "../models/Post.js";
import CommentModel from "../models/Comment.js";

export const getLastTags = async (req, res) => {
    try {
      const tags = await PostModel.find()
        .sort({ createdAt: -1 })
        .limit(25)
        .distinct('tags')
        .exec();
  
      res.json(tags);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить тэги',
      });
    }
};

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
    const doc = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { ReturnDocument: 'after' }
    ).populate('user');

    if (!doc) {
      return res.status(404).json({ message: 'Статья не найдена', error: err });
    }

    res.json(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Не удалось получить статьи' });
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
                        message: 'Не удалось удалить статью',error: err});
            }
        })
        
    }   catch (err) {
            console.log(err);
            res.status(500).json({message: 'Не удалось получить статьии'});
        }
};

export const create = async (req, res) => {
    try {
      const tags = req.body.tags.replace(/#/g, '').split(',');
      const doc = new PostModel({ 
      title: req.body.title, 
      text: req.body.text, 
      imageUrl: req.body.imageUrl, 
      user: req.userId, 
      tags: tags, 
    });

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
                tags: req.body.tags.split(','),
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
};

export const getPostComments = async (req, res) => {
  try {
      const post = await PostModel.findById(req.params.id)
      const list = await Promise.all(
          post.comments.map((comment) => {
              return CommentModel.findById(comment)
          }),
      )
      res.json(list)
  } catch (err) {
      res.json({ message: 'Что-то пошло не так.' })
  }
};