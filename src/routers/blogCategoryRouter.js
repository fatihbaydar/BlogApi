"use strict"

const router = require("express").Router()
const categoryController=require("../controllers/blogCategoryController")
//BlogCategoryRouter
router.route("/").get(categoryController.list).post(categoryController.create)
router.route("/:categoryId").get(categoryController.read).put(categoryController.update).delete(categoryController.delete)


module.exports=router