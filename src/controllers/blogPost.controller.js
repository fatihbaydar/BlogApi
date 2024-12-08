"use strict"

const { BlogPost } = require("../models/blogPost.models")
const { NotFoundError } = require("../errors/customError")

module.exports.blogPost = {
    list: async (req, res) => {
        const data = await BlogPost.find().populate("categoryId");
        res.send({
            result: data,
        });
    },
    create: async (req, res) => {
        const result = await BlogPost.create(req.body);
        res.send({
            result,
        });
    },
    read: async (req, res) => {
        const result = await BlogPost.updateOne(
            { _id: reqq.params.postId },
            req.body
        );
        res.status(202).send({
            isError: false,
            result,
            new: await BlogPost.findOne({ _id: req.params.postId }),
        });
    },
    delete: async (req, res) => {
        const result = await BlogPostdeleteOne({ _id: req.params.postId });
        if (result.deletedCount === 0) {
            throw new NotFoundError("No matching documents found");
        }
        res.status(204).send({ result, });
    },
};
