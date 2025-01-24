const express = require('express');
const app = express();
const {
  validateClient,
  validateUser
} = require('../middleware/validateRequest');
const router = express.Router();

const UserController = require('../controller/UserController');
const ClientController = require('../controller/ClientController');
const LoginController = require('../controller/loginController');

const handleSignout = require('../controller/logout');
const { handleRef } = require('../controller/refreshToken');

const UacPermission = require('../middleware/UacMiddleware.js');
const { upload } = require('../services/uploadService.js');
const roleVerify = require('../middleware/roleVerify.js');
const TimeTrackController = require('../controller/TimeTrackController');

app.post('/upload-avatar', upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({
    message: 'File uploaded successfully',
    filePath: `/uploads/${req.file.filename}`
  });
});

app.use('/uploads', express.static('uploads'));

router.post('/register/user', validateUser,
// roleVerify('admin'),
UserController.signup);

// router.post("/register/confclient", UacPermission("edit_tasks"), ClientController.confClient)
router.post('/register/confclient', ClientController.confClient);
router.post('/register/client', validateClient, roleVerify('admin'), ClientController.createClient);

router.post('/login', LoginController.login);
router.post('/logout', handleSignout);
//Refresh token
router.post('/refresh', handleRef);

router.post('/setTimeTrack', TimeTrackController.createTimeTrack);
router.get('/getTimeTracksForUser', TimeTrackController.getTimeTracksForUser);
router.get('/getAllTimeTracksForUser', TimeTrackController.getAllTimeTracksForUser);

module.exports = router;