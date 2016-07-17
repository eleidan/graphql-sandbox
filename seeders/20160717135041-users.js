'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    console.log('User');
    return queryInterface.bulkInsert('Users', [{
      name: 'Tony Stark',
      age: 45,
      createdAt: new Date(),
      updatedAt: new Date(),
    },{
      name: 'Yankee',
      age: 33,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
