import CommentModel from '../models/Comment.js'
import PostModel from '../models/Post.js'

export const createComment = async (req, res) => {
    try {
        const { postId, comment } = req.body

        if (!comment)
            return res.json({ message: 'Комментарий не может быть пустым' })

        const newComment = new CommentModel({ comment })
        await newComment.save()

        try {
            await PostModel.findByIdAndUpdate(postId, {
                $push: { comments: newComment._id },
            })
        } catch (err) {
            console.log(err)
        }

        res.json(newComment)
    } catch (err) {
        res.json({ message: 'Что-то пошло не так.' })
    }
}