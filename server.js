const { v4: uuid, validate: uuidValidate } = require('uuid');
const express = require('express');
const {check, validationResult} = require('express-validator/check');
const bodyParser = require('body-parser');
const { MOCK_USERS, BILLY_ID, JIMMY_ID } = require('./constants/mock-users');


const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 9001;

const EXISTING_USERS = {
    ...MOCK_USERS,
};

const userValidation = [
    check(
        'first_name'
    ).exists().withMessage('You must include a first name'),
    check('email').isEmail().withMessage('Must include email'),
    check(
        'password'
    ).isLength({min: 8}).withMessage('Password must be at least 8 characters'),
];

app.get('/api/home/', (request, response) => {
    response.send({content: 'Hello From Server'})
});


app.get('/api/get-user/:id', (request, response) => {
    const id = request.params.id;
    if (!uuidValidate(id)) {
        response.status(400).send({errors: ['Invalid user id']})
        return;
    }

    const user = EXISTING_USERS[id];
    if (!user) {
        response.status(404).send({errors: ['User not found']});
        return;
    }

    response.send({
        user: {
            first_name: user.first_name,
            email: user.email,
        }
    });
});

app.post('/api/users/', userValidation, (request, response) => {
    const errors = validationResult(request);
    if(!errors.isEmpty()) {
        response.status(404).send({errors: errors.mapped()});
        return;
    }

    const user = {
        first_name: request.body.first_name,
        email: request.body.email,
        password: request.body.password,
    };
    const id = Math.floor(Math.random() * 20);
    EXISTING_USERS[id] = user;

    response.send({
        user,
        message: 'User created successfully',
        id,
    })
});


module.exports = app.listen(
    port, () => console.log(`Listening on port ${port} ${BILLY_ID} ${JIMMY_ID}`));
