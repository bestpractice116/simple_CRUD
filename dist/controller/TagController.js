const tagService = require('../services/TagService');

class TagController {
  //Create Tag.
  async createTag(req, res) {
    try {
      const Tag = await tagService.createTag(req.body);
      res.status(201).json({ message: 'Tag created successfully', Tag });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllTags(req, res) {
    try {
      const Tags = await tagService.getAllTags();
      res.status(200).json(Tags);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateTag(req, res) {
    try {
      const updatedTag = await tagService.updateTag(req.params.id, req.body);
      res.status(200).json({ message: 'Tag updated successfully', Tag: updatedTag });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async deleteTag(req, res) {
    try {
      await tagService.deleteTag(req.params.id);
      res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

module.exports = new TagController();