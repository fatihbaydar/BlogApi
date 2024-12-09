"use strict"
//!MODEL
//? BlogCategorySchema
const mongoose=require("mongoose")
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

  // CRUD İŞLEMLERİNİ YAPABİLMEK İÇİN MODELE İHTİYAÇ VARDIR.
  // model(modelismi,şemanın ismi)

module.exports =  mongoose.model("BlogCategory",BlogCategorySchema);