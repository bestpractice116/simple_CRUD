const { body } = require('express-validator');

exports.validateClient = [
  body('first_name').notEmpty().withMessage('First name is required'),
  body('last_name').notEmpty().withMessage('Last name is required'),
  body('business_name').notEmpty().withMessage('Business name is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('zip').notEmpty().withMessage('Zip code is required'),
  body('dob').notEmpty().withMessage('Date of birth is required'),
  body('doj').notEmpty().withMessage('Date of joining is required')
];

exports.validateUser = [
  body('first_name').notEmpty().withMessage('First name is required'),
  body('last_name').notEmpty().withMessage('Last name is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('address').notEmpty().withMessage('Address is required')
];
