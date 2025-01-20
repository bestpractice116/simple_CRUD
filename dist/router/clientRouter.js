const express = require('express');
const router = express.Router();
const app = express();

const ProjectController = require('../controller/ProjectController');

const UacPermission = require('../middleware/UacMiddleware');
const TaskController = require('../controller/TaskController');

//Router for project CRUD action.
router.post('/', async (req, res) => {
  res.status(200).json('OK');
});
router.get('/dashboard', ProjectController.getAllProjectsForClient);

router.post('/dashboard/getprojectbyid', UacPermission('edit_task', 'delete_tasks'), ProjectController.getProjectById);

//Router for favourite Project action
router.post('/dashboard/addfavourproject', ProjectController.addFavouriteProject);
router.get('/dashboard/getfavourproject', ProjectController.getAllFavouriteProjects);
router.delete('/dashboard/removefavour', ProjectController.removeFavouriteProject);

//Router for favourite Project action
router.post('/dashboard/addfavortask', TaskController.addFavouriteTask);
router.get('/dashboard/getfavourtask', TaskController.getAllFavouriteTasks);
router.delete('/dashboard/removefavourtask', TaskController.removeFavouriteTask);

module.exports = router;