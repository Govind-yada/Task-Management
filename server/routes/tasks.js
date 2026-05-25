const express = require('express');
const { body } = require('express-validator');
const { getTasks, createTask, updateTask, deleteTask, toggleTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const taskValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('status').optional().isIn(['todo', 'in-progress', 'completed']).withMessage('Invalid status'),
  body('dueDate').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('Invalid date format'),
];

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(taskValidation, createTask);

router.route('/:id')
  .put(taskValidation, updateTask)
  .delete(deleteTask);

router.patch('/:id/toggle', toggleTask);

module.exports = router;
