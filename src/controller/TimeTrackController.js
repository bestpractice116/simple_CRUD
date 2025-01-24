const TimeTrackService = require('../services/TimeTrackService');
const roleService = require('../services/roleService');

const { getAuthenticatedUser } = require('../middleware/verifyUser');
require('../middleware/verifyUser');

class TimeTrackController {
  //Create timeTrack.
  async createTimeTrack(req, res) {
    try {
      const timeTrack = await TimeTrackService.createTimeTrack(req.body);
      res.status(201).json(timeTrack);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllTimeTracks(req, res) {
    try {
      const timeTracks = await TimeTrackService.getAllTimeTracks();
      res.status(200).json(timeTracks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllTimeTracksForPeriod(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const timeTracks = await TimeTrackService.getAllTimeTracksForPeriod(
        startDate,
        endDate
      );
      res.status(200).json(timeTracks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllTimeTracksForUser(req, res) {
    try {
      const userinfo = getAuthenticatedUser(req);
      const timeTracks = await TimeTrackService.getAllTimeTracksForUser(
        userinfo.id
      );
      res.status(200).json(timeTracks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getTimeTracksForUser(req, res) {
    try {
      const userinfo = getAuthenticatedUser(req);
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res
          .status(400)
          .json({ message: 'Start date and end date are required.' });
      }
      const timeTracks = await TimeTrackService.getTimeTracksForUser(
        userinfo.id,
        startDate,
        endDate
      );
      res.status(200).json(timeTracks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateTimeTrack(req, res) {
    try {
      const updatedTimeTrack = await timeTrackService.updateTimeTrack(req.body);
      res.status(200).json({
        message: 'timeTrack updated successfully',
        timeTrack: updatedTimeTrack
      });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async deletetimeTrack(req, res) {
    try {
      const { timeTrackId } = req.query;
      await timeTrackService.deleteTimeTrack(timeTrackId);
      res.status(200).json({ message: 'timeTrack deleted successfully' });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

module.exports = new TimeTrackController();
