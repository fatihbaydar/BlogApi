"use strict";
/* -------------------------------------------------------
  Mustafa Fatih     -- dosya klasör yapısı
  Özkan             -- Db connection
  Onur Emre         -- blogcategory, model, controller, router
  Hüseyin Cem       -- errorhandler
  Payas             -- blogpostcontroller model, router
------------------------------------------------------- */
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("express-async-errors");
const httpStatusCodes = require("http-status-codes");
require("dotenv").config();
const router = require("express").Router()
const PORT = process.env.PORT || 8000;

app.use(express.json());

//!DB Connection

const dbConnection = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("mongodb_uri is necessary");
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connection is succesfull");
  } catch (error) {
    console.log("Database connection error");
    throw new Error("Failed to connect to the database", 500);
  }
};

dbConnection();



//? BlogPostSchema
// Model

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
    collection: "blogPosts",
    timestamps: true,
  }
);

const BlogPostModel = mongoose.model("BlogPostModel", BlogPostSchema)

// BlogPostController
const postController = {
  list: async (req, res) => { },

  // CRUD ->

  create: async (req, res) => { },

  read: async (req, res) => { },

  update: async (req, res) => { },

  delete: async (req, res) => { },
};

// BlogPostRouter

router.route("/blog/post").get(postController.list).post(postController.create)
router.route("/blog/post/:postId").get(postController.read).put(postController.update).delete(postController.delete)












//!ROUTES
app.all("/", (req, res) => {
  res.send({
    message: "Kolay gelsin",
  });
});

app.use("/blog/category", require("./src/routers/blogCategoryRouter"))




app.use("*", (req, res) => {
  res.status(404).send({ isError: true, message: "The route is NOT FOUND" });
});

//!Error Handler
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode || 500;
  res.status(statusCode).send({
    isError: true,
    message: err.message
  });
};

app.use(router)
app.use(errorHandler)
app.listen(PORT, () => console.log("Running:http//127.0.0.1" + PORT));
