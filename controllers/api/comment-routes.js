const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const authenticate = require('../../utils/aut');


router.post('/', authenticate, (req, res) => {

    Comment.create(
        {
            text_content: req.body.text_content,
            user_id: req.session.user_id, //Replace with session ID
            post_id: req.body.post_id
        }
    )
    .then(userCommentData => {
        res.json(userCommentData)
    })
    .catch(err => {
        res.status(400).json(err)
    });
});

module.exports = router;