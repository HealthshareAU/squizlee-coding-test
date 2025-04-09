const express = require('express');
const {check, validationResult} = require('express-validator/check');
const cors = require('cors')
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());
app.use(cors({origin: 'http://localhost:3000'}));
const port = process.env.PORT || 9001;

let existingUsers = {
    9: {
        firstName: 'Billy',
        email: 'billy@gmail.com',
        password: 'ilikeicecream123',
        favouriteFruit: 'Mango',
    },
    2: {
        firstName: 'Jimmy',
        email: 'jimmy@gmail.com',
        password: 'iamnotfondoficecream1234',
        favouriteFruit: 'Apple',
    },
};

const userValidation = [
    check(
        'first_name'
    ).exists().withMessage('You must include a first name'),
    check('email').isEmail().withMessage('Must include email'),
    check(
        'password'
    ).isLength({min: 8}).withMessage('Password must be at least 8 characters'),
    check('favourite_fruit').exists().withMessage('You must include a favourite fruit!'),
];

app.get('/api/home/', (request, response) => {
    response.send({content: 'Hello From Server'})
});


app.get('/api/get-user/:id([0-9]{1})', (request, response) => {
    const id = request.params.id;
    let user = null;
    try {
        user = existingUsers[id];
    } catch(err) {
        response.status(404).send({errors: ['User not found']});
    }

    response.send({user})
});

app.post('/api/users/', userValidation, (request, response) => {
    const errors = validationResult(request);
    if(!errors.isEmpty()) {
        response.status(404).send({errors: errors.mapped()});
        return;
    }

    const user = {
        firstName: request.body.first_name,
        email: request.body.email,
        password: request.body.password,
        favouriteFruit: request.body.favourite_fruit,
    };
    const id = Math.floor(Math.random() * 20);
    existingUsers[id] = user;

    response.send({
        user,
        message: 'User created successfully',
        id,
    })
});


module.exports = app.listen(
    port, () => console.log(`Listening on port ${port}`));
