"use strict"

const router = require("express").Router()
const postController = require("../controllers/blogPost.controller")

router.route("/").get(postController.list).post(postController.create)
router.route("/").get(postController.read).put(postController.update).delete(postController.delete)

module.exports = router