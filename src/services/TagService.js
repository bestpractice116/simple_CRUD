const Tag = require('../../models/Tag');

const createTag = async (data) => {
  return await Tag.create(data);
};

const getAllTags = async () => {
  return await Tag.findAll();
};

const updateTag = async (id, data) => {
  try {
    const tag = await Tag.findByPk(id);
    if (tag) {
      await tag.update(data);
      return { message: 'Tag Updated Successfully.' };
    }
    throw new Error('Tag Not Found!');
  } catch (error) {
    throw error;
  }
};

const deleteTag = async (id) => {
  const tag = await Tag.findByPk(id);
  if (tag) {
    // tag.removeAssignedTagProject();
    // tag.removeAssignedTagTask();
    await tag.destroy();
    return { message: 'Tag Deleted Correctly.' };
  }
  throw new Error('Tag Not Found!');
};

module.exports = {
  createTag,
  getAllTags,
  updateTag,
  deleteTag
};
