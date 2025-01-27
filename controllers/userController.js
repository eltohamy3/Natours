/* eslint-disable prettier/prettier */
const fs = require('fs');

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users: users,
    },
  });
};

exports.CreateUser = (req, res) => {
  res.status(201).json({
    status: 'success',
    data: {
      users: 'THis is the new user',
    },
  });
};
exports.getUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: 'this is the user',
    },
  });
};
exports.UpdateUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: 'this is the new user after updating',
    },
  });
};
exports.DeleteUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'user not found',
  });
};
