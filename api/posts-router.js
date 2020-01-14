const express = require("express");

const router = express.Router();

const db = require("../data/db");

router.use(express.json());

// --------------- GET requests --------------- //

router.get("/", (req, res) => {
    db.find(req.query)
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(err => {
        console.log(err)
        res
        .status(500)
        .json({error: "The posts information could not be retrieved"})
    })
})

router.get("/:id", (req, res) => {
    db.findById(req.params.id)
    .then(post => {
        if (post) {
            res.status(200).json(post)
        } else {
            res
            .status(404)
            .json({message: "The post with this specific ID does not exist"})
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: "Error getting this post"})
    })
})

router.get("/:id/comments", (req, res) => {
    const postId = req.params.id;

    db.findPostComments(postId)
    .then(comments => {
        res.status(200).json(comments);
    })
    .catch(err => {
        console.log(err)
        res
        .status(500)
        .json({error: "The comments info could not be retrieve"})
    })
})

// ---------------- POST requests ------------------------------ //

router.post("/", (req, res) => {
    const postData = req.body;

    if (!postData.title || !postData.contents) {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post"
        })
    }

    db.insert(postData)
    .then(post => {
        res.status(201).json(post)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: "There was an error while saving the post to the Database"})
    })
})

router.post("/:id/comments", (req, res) => {
    const postData = req.body
    const postId = req.params.id

    if (!postId) {
        res
        .status(404)
        .json({message: "The post with this ID does not exist"})
    }

    if (!postData.text) {
        res
        .status(400)
        .json({errorMessage: "Please provide text for the comment"})
    }

    db.insertComment(postData)
    .then(comment => {
        res.status(201).json(comment)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: "There was an error while saving the comment to the database"
        })
    })
})

// ------------------ DELETE requests -------------------------- //

router.delete("/:id", (req, res) => {
    db.remove(req.params.id)
    .then(count => {
        if (count > 0) {
            res.status(200).json({message: "The Post has been terminated"})
        } else {
            res
            .status(404)
            .json({message: "The post with this specific ID does not exist"})
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: "The POST could not be removed"})
    })
})

// -------------- PUT requests ------------------ //

router.put("/:id", (req, res) => {
    const changes = req.body

    if (!changes.title || !changes.contents) {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post"
        })
    }

    db.update(req.params.id, changes)
    .then(post => {
        if (post) {
            res.status(200).json(post)
        } else {
            res
            .status(404)
            .json({message: "The post with this ID does not exist"})
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({message: "Error updating the hub"})
    })
})


module.exports = router;