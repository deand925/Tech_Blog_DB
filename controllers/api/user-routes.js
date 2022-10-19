const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

//Get all Users
router.get('/', async (res, req) => {
    User.findAll({

    })
        .then(userData => res.json(userData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

// Get User by id
router.get('/:id', (req, res) => {
    User.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'text_content', 'created_at'],
            },
            {
                model: Comment,
                attributes: ['id', 'text_content', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            },
        ]
    })
        .then(userData => {
            if (!userData) {
                res.status(404).json({ message: "User not found" });
            }
            res.json(userData);
        })
        .catch(err => {
            res.status(500).json(err)
        })

})

//Create a new User
router.post('/', (req, res) => {
    //Checks to see if there is already a User with that name
    const alreadyUser = await.User.findOne({
        where: {
            username: req.body.username
        }
    });
    
    if (alreadyUser){
        res.status(400).json({message: 'Already a user with that username'})
        return;
    }
    //Creates new User if no one already has that Username 
    User.create({
        username: req.body.username,
        password: req.body.password
    })
    .then(userData => {
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.username = userData.username;
            req.session.loggedIn = true;

            res.json(userData);
        })
    })
    //If error display error
    .catch(err => {
        res.status(500).json(err);
    })
})

//User login
router.post('/login', (req, res) => {
    //Find User by username
    User.findOne({
        where: {
            username: req.body.username
        }
    })
        .then(usersData => {
            //Checks if there is a user with that username
            if (!usersData) {
                res.status(400).json({ message: "No user found!" })
                return;
            }
            
            //Checks if password matches the password in the db
            const validPassword = usersData.checkPassword(req.body.password);

            //If not a matching password return error
            if (!validPassword) {
                res.status(400).json({ message: 'Password Incorrect!' });
                return;
            }

            req.session.save(() => {
                req.session.user_id = usersData.id;
                req.session.username = usersData.username;
                req.session.loggedIn = true;

                res.json({ message: "You are logged in" });
            });
        });
});

//User logout 
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(400).json(err)
        });
    }
    else {
        res.status(400).json(err);
    }
})