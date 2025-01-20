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
router.post('/createproject', UacPermission('edit_project', 'delete_projects'), ProjectController.createProject);
router.put('/dashboard/updateproject', UacPermission('edit_project', 'delete_projects'), ProjectController.updateProject);
router.delete('/dashboard/deleteproject', UacPermission('edit_project', 'delete_projects'), ProjectController.deleteProject);

router.get('/dashboard', ProjectController.getAllProjectsForUser);
router.post('/dashboard/getprojectbyid', ProjectController.getProjectById);

//Router for favourite Project action
router.post('/dashboard/addfavourproject', ProjectController.addFavouriteProject);
router.get('/dashboard/getfavourproject', ProjectController.getAllFavouriteProjects);
router.delete('/dashboard/removefavour', ProjectController.removeFavouriteProject);

//Router for task CRUD action.
router.post('/createtask', UacPermission('edit_task', 'delete_tasks'), TaskController.createTask);
router.put('/dashboard/updatetask', UacPermission('edit_task', 'delete_tasks'), TaskController.updateTask);
router.delete('/dashboard/deletetask', UacPermission('edit_task', 'delete_tasks'), TaskController.deleteTask);

router.get('/getalltask', UacPermission('edit_task', 'delete_tasks'), TaskController.getAllTasksForUser);
router.get('/dashboard/favouriteproject', UacPermission('edit_task', 'delete_tasks'), TaskController.getAllFavouriteTasks);

router.post('/dashboard/gettaskbyid', UacPermission('edit_task', 'delete_tasks'), TaskController.getTaskById);

//Router for favourite Project action
router.post('/dashboard/addfavortask', TaskController.addFavouriteTask);
router.get('/dashboard/getfavourtask', TaskController.getAllFavouriteTasks);
router.delete('/dashboard/removefavourtask', TaskController.removeFavouriteTask);

module.exports = router;