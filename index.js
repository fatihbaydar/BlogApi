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

//!MODEL
//? BlogCategorySchema

const BlogCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    collection: "blogCategories",
    timestamps: true,
  }
);
const BlogCategory = mongoose.model("BlogCategory", BlogCategorySchema);

// BlogCategoryController
const categoryController = {
  list: async (req, res) => {
    //  const data = await BlogCategory.find({});
    const data = await BlogCategory.find();

    res.send({
      result: data,
    });
  },

  // CRUD ->

  create: async (req, res) => {
    console.log(req.body)
    const result = await BlogCategory.create(req.body);

    res.send({
      result,
    });
  },

  read: async (req, res) => {
    //! findOne({filter},{projection})   filter+projection
    //! findOne({filter},{projection}).limit(10)..sort({ createdAt: -1 }).skip(5)
    //const id=req.params.categoryId

    // Veride istenmeyen field varsa false yada 0 ile döndürülmeyebilir
    //const result = await BlogCategory.findOne({ _id: req.params.categoryId },{_id:0,name:1});
    const result = await BlogCategory.findOne(
      { _id: req.params.categoryId },
      { _id: 0, name: 1 }
    );
    if (!result) {
      throw new NotFoundError("No matching documents found");
      // return res.status(404).send("No matching documents found");
    }
    res.send({
      isError: false,
      result,
    });
  },

  update: async (req, res) => {
    //updateOne({filter},{update},{options})
    //! findByIdAndUpdate=> findOne+updateOne
    // const updatedUser = await User.findByIdAndUpdate(
    //   "64f8b0c9e9f8d7369c3c4f31", // _id
    //   { name: "John" },
    //   { new: true } // Güncellenmiş belgeyi döndür
    // );

    //options
    //upsert: Belge bulunamazsa yeni bir belge oluşturur. (true veya false, varsayılan: false)
    const result = BlogCategory.updateOne(
      { _id: req.params.categoryId },
      req.body
    );

    //matchedCount:0,1,2   modifiedCount=0,1  durumu
    //!güncellenmek istenen veri yoksa
    if (result.matchedCount === 0) {
      throw new NotFoundError("No matching documents found");
    }
    //! güncellenmek istenen veri ama ama güncelleme yapılmadı
    if (result.matchedCount > 0 && result.modifiedCount === 0) {
      return res.status(200).send({ message: "Document already up-to-date." });
    }
    res.status(202).send({
      isError: false,
      result,
      updated: await BlogCategory.findOne({ _id: req.params.categoryId }),
    });
  },

  delete: async (req, res) => {
    const result = await BlogCategory.deleteOne({ _id: req.params.categoryId });
    //deletedCount
    if (result.deletedCount === 0) {
      throw new NotFoundError("No matching documents found");
      // return res.status(404).send("No matching documents found");
    }
    //! 204 ile veri gönderilmez
    res.status(204).send({
      result,
    });
  },
};

//BlogCategoryRouter
router.route("/blog/category").get(categoryController.list).post(categoryController.create)
router.route("/blog/category/:categoryId").get(categoryController.read).put(categoryController.update).delete(categoryController.delete)



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

const BlogPostModel =mongoose.model("BlogPostModel", BlogPostSchema)

// BlogPostController
const postController = {
    list: async (req, res) => {},
  
    // CRUD ->
  
    create: async (req, res) => {},
  
    read: async (req, res) => {},
  
    update: async (req, res) => {},
  
    delete: async (req, res) => {},
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
