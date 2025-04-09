const { v4: uuid } = require('uuid');

const BILLY_ID = uuid();
const JIMMY_ID = uuid();

const MOCK_USERS = {
    [BILLY_ID]: {
        first_name: 'Billy',
        email: 'billy@gmail.com',
        password: 'ilikeicecream123'
    },
    [JIMMY_ID]: {
        first_name: 'Jimmy',
        email: 'jimmy@gmail.com',
        password: 'iamnotfondoficecream1234'
    }
}

module.exports = {
    MOCK_USERS,
    BILLY_ID,
    JIMMY_ID
}
