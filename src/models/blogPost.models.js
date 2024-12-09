"use strict"

const mongoose = require("mongoose");

const BlogPostSchema = new mongoose.Schema(
    {
      categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BlogCategory",
        required: true,
      },
      title: {
        type: mongoose.Schema.Types.String,
        trim: true,
        required: true,
      },
      content: {
        type: String,
        trim: true,
        required: true,
      },
      // createdAt // timestamps: true
      // updatedAt // timestamps: true
    },
    {
      collection: "blogPostsModel",
      timestamps: true,
    }
  );
  

  module.exports =  mongoose.model("BlogPostModel", BlogPostSchema)