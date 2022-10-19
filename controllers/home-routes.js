const { post } = require('.');
const { Post, User, Comment } = require('../models');
const authenticate = require('../utils/auth');
const router = require('express').Router();

//Return Homepage
router.get('/',(req, res) => {
    Post.findAll({
        attributes: [
            'id',
            'title',
            'created_at'
        ],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbData => {

        const posts = dbData.map(post => post.get({plain:true}));

        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn,
            user: req.session.username
        });
    })
    .catch( err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Display a single User Post
router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'title',
            'text_content',
            'created_at'
        ],
        include: [
            {
                model: Comment,
                attributes: ['id','text_content', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbData => {
        if(!dbData){
            res.status(400).json({ message: 'No posts found by that user'});
            return;
        }
        const post = dbData.get({plain: true});
        res.render('single-post', {post, loggedIn: req.session.loggedIn, user: req.session.username});
    })
    .catch(err => {
        res.status(500).json(err)
    });
});

//Edit post by User ID
router.get('/post/edit/:id', authenticate, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'title',
            'text_content',
            'created_at',
            'user_id'
        ],
        include: [
            {
                model: Comment,
                attributes: ['id','text_content', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbData => {
        if(!dbData){
            res.status(404).json({ message: 'No post found by that id'});
            return;
        }
        const post = dbData.get({plain: true});

        if(post.user_id !== req.session.user_id){
            res.redirect('/')
        }
        res.render('edit-post', {post, loggedIn: res.session.loggedIn, user: res.session.username});
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

//Display Homepage
router.get('/dashboard', authenticate, (req, res) => {
    if(!req.session.loggedIn){
        res.redirect('/');
        return;
    }

    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'title',
            'created_at'
        ],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbData => {
        const posts = dbData.map(post => post.get({plain: true}));

        res.render('dashbaord', {
            posts,
            loggedIn: req.session.loggedIn,
            user: req.session.username
        });
    })
    .catch(err => {
        res.status(500).json(err);
    })
})

//Signup
router.get('/signup', (req, res) => {
    if (req.session.loggedIn){
        res.redirect('/');
        return;
    }
    res.render('signup');
})

module.exports = router;