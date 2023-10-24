
import PostModel from "../models/Post.js";

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imagerUrl: req.body.imagerUrl,
            tags: req.body.tags,
            user: req.userId,
        });
        const post = await doc.save();

        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось создать статью'
        });
    }
};

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit().exec();

        const tags = posts
            .map(obj => obj.tags)
            .flat()
            .slice(0, 5)
        res.json(tags);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить статьи'
        });
    }
};
export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить статьи'
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const filter = { _id: postId };
        const update = { $inc: { viewsCount: 1 } };
        const opts = { new: true };

        const checkerror = (err, doc) => {
            if (err) {
                console.log(error);
                return res.status(500).json({
                    message: 'Не удалось вернуть статьи'
                });
            }
            if (!doc) {
                console.log(error);
                return res.status(404).json({
                    message: 'Не найти статью'
                });
            }
        }

        let post = await PostModel.findOneAndUpdate(filter, update, opts).populate('user').exec();
        res.json(post);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить статью'
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const filter = { _id: postId };
        //if (!cinema) return res.sendStatus(404);

        let post = await PostModel.findByIdAndDelete(filter);
        if (!post) return res.status(404).json({
            message: 'Не удалось найти статью'
        });
        res.json(post);


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить статью'
        });
    }
};


export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        const filter = { _id: postId };
        const update = {
            title: req.body.title,
            text: req.body.text,
            imagerUrl: req.body.imagerUrl,
            tags: req.body.tags,
            user: req.userId,
        };

        let post = await PostModel.updateOne(filter, update);
        if (!post) return res.status(404).json({
            message: 'Не удалось найти статью'
        });
        res.json({
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось обновить статью'
        });
    }
};