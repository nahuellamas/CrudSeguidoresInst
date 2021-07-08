
const Role = require('../models/role');

const createRoles = async () => {
    const count  = await Role.estimatedDocumentCount()
    if(count > 0) {
        return;
    }
    const value = await Promise.all([
        new Role({nombre: 'user'}).save(),
        new Role({nombre: 'admin'}).save()
    ])
    
};

module.exports = createRoles;