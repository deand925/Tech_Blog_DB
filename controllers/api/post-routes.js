const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const authenticate = require('../../utils/aut')

//Route to get all Posts
router.get('/', (req, res) => {
    Post.findAll({

    })
        .then(userPostData => res.json(userPostData))
        .catch(err => {
            res.status(500).json(err)
        })
});

//Route to get Post by id
router.get('/:id', (req, res) => {
    // Finds post with matching id
    Post.fineOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Comment,
                atrributes: ['id', 'text_content', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    atrributes: ['username']
                }
            }
        ]
    })
        .then(userPostData => {
            if (!userPostData) {
                res.status(404).json({ message: 'Post not found by that id' });
            }
            res.json(userPostData)
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

//Create a new User Post
router.post('/', authenticate, (req, res) => {
    // Create with these attributes
    Post.create({
        title: req.body.title,
        text_content: req.body.text_content,
        user_id: req.session.user_id
    })
        .then(userPostData => {
            res.json(userPostData);
        })
        .catch(err => {
            res.status(500).json(err)
        });
});

// Update a User Post
router.put('/:id', authenticate, (req,res) => {
    //Updates Post with matching id
    Post.update(
        {
            title: req.body.title,
            text_content: req.body.text_content
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
        .then(userPostData => {
            // Checks is post matches id
            if (!userPostData) {
                res.status(404).json({ message: 'No post found by that id' });
                return;
            }
            res.json(userPostData);
        })
        .catch(err => {
            res.status(500).json(err)
        });
});

//Delete a User Post
router.delete('/:id', authenticate, (req, res) => {
    //Deletes Post with matching id
    Post.destroy(
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(userPostData => {
        // Checks is post matches id
        if(!userPostData){
            res.status(404).json({ message: 'Post not found by that id'});
            return;
        }
        res.json(userPostData)
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

module.exports = router;