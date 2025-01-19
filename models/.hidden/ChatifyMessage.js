const { Op } = require('sequelize');
const Pusher = require('pusher');
const { Message, Favorite, User } = require('..'); // Adjust paths as needed
const { getAuthenticatedUser } = require('../utils/auth'); // Custom helper for getting authenticated user
const { Storage } = require('../utils/storage'); // Custom helper for file management

class ChatifyMessenger {
  constructor() {
    this.pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.PUSHER_CLUSTER,
      encrypted: true,
    });
  }

  // Get max file's upload size in MB
  getMaxUploadSize() {
    return parseInt(process.env.CHATIFY_ATTACHMENTS_MAX_UPLOAD_SIZE) * 1048576;
  }

  // Allowed image extensions
  getAllowedImages() {
    return JSON.parse(process.env.CHATIFY_ATTACHMENTS_ALLOWED_IMAGES);
  }

  // Allowed file extensions
  getAllowedFiles() {
    return JSON.parse(process.env.CHATIFY_ATTACHMENTS_ALLOWED_FILES);
  }

  // Messenger colors
  getMessengerColors() {
    return JSON.parse(process.env.CHATIFY_COLORS);
  }

  // Fallback primary color
  getFallbackColor() {
    const colors = this.getMessengerColors();
    return colors.length > 0 ? colors[0] : '#000000';
  }

  // Trigger an event using Pusher
  push(channel, event, data) {
    return this.pusher.trigger(channel, event, data);
  }

  // Pusher authentication
  async pusherAuth(requestUser, authUser, channelName, socketId) {
    const authData = JSON.stringify({
      user_id: authUser.id,
      user_info: { name: authUser.name },
    });

    if (requestUser.id === authUser.id) {
      return this.pusher.authenticate(socketId, channelName, authData);
    } else {
      throw new Error('Unauthorized');
    }
  }

  // Parse message to return message card data
  async parseMessage(prefetchedMessage = null, id = null) {
    const msg = prefetchedMessage || await Message.findByPk(id);
    if (!msg) return {};

    let attachment = null;
    let attachmentType = null;
    let attachmentTitle = null;

    if (msg.attachment) {
      const attachmentObj = JSON.parse(msg.attachment);
      attachment = attachmentObj.new_name;
      attachmentTitle = attachmentObj.old_name;
      const ext = attachment.split('.').pop();
      attachmentType = this.getAllowedImages().includes(ext) ? 'image' : 'file';
    }

    return {
      id: msg.id,
      from_id: msg.from_id,
      to_id: msg.to_id,
      message: msg.body,
      attachment: { file: attachment, title: attachmentTitle, type: attachmentType },
      timeAgo: msg.created_at.toISOString(),
      created_at: msg.created_at.toISOString(),
      isSender: msg.from_id === getAuthenticatedUser().id,
      seen: msg.seen,
    };
  }

  // Create a new message
  async newMessage(data) {
    const message = await Message.create({
      from_id: data.from_id,
      to_id: data.to_id,
      workspace_id: data.workspace_id,
      body: data.body,
      attachment: data.attachment,
    });
    return message;
  }

  // Mark messages as seen
  async makeSeen(user_id) {
    await Message.update({ seen: 1 }, {
      where: {
        from_id: user_id,
        seen: 0,
        to_id: getAuthenticatedUser().id,
        workspace_id: getAuthenticatedUser().workspace_id,
      }
    });
  }

  // Get the last message for a specific user
  async getLastMessageQuery(user_id) {
    return Message.findOne({
      where: {
        [Op.or]: [
          { from_id: getAuthenticatedUser().id, to_id: user_id },
          { from_id: user_id, to_id: getAuthenticatedUser().id },
        ],
        workspace_id: getAuthenticatedUser().workspace_id,
      },
      order: [['created_at', 'DESC']],
    });
  }

  // Count unseen messages
  async countUnseenMessages(user_id) {
    return Message.count({
      where: {
        from_id: user_id,
        seen: 0,
        to_id: getAuthenticatedUser().id,
        workspace_id: getAuthenticatedUser().workspace_id,
      },
    });
  }

  // Get contact item for user (last message, unseen count)
  async getContactItem(user) {
    try {
      const lastMessage = await this.getLastMessageQuery(user.id);
      const unseenCounter = await this.countUnseenMessages(user.id);

      if (lastMessage) {
        lastMessage.timeAgo = lastMessage.created_at.diffForHumans();
      }

      return {
        user: await this.getUserWithAvatar(user),
        lastMessage: lastMessage,
        unseenCounter: unseenCounter,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get user with avatar formatted
  async getUserWithAvatar(user) {
    if (user.avatar === 'avatar.png' && process.env.CHATIFY_GRAVATAR_ENABLED) {
      const imageSize = process.env.CHATIFY_GRAVATAR_IMAGE_SIZE;
      user.avatar = `https://www.gravatar.com/avatar/${md5(user.email.toLowerCase())}?s=${imageSize}`;
    } else {
      user.avatar = await this.getUserAvatarUrl(user.avatar);
    }
    return user;
  }

  // Check if user is in favorites
  async inFavorite(user_id) {
    const favorite = await Favorite.count({
      where: {
        favorite_id: user_id,
        user_id: getAuthenticatedUser().id,
        workspace_id: getAuthenticatedUser().workspace_id,
      },
    });
    return favorite > 0;
  }

  // Add/remove user from favorites
  async makeInFavorite(user_id, action) {
    if (action > 0) {
      await Favorite.create({
        user_id: getAuthenticatedUser().id,
        workspace_id: getAuthenticatedUser().workspace_id,
        favorite_id: user_id,
      });
    } else {
      await Favorite.destroy({
        where: {
          user_id: getAuthenticatedUser().id,
          favorite_id: user_id,
        },
      });
    }
  }

  // Get shared photos of conversation
  async getSharedPhotos(user_id) {
    const images = [];
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { from_id: getAuthenticatedUser().id, to_id: user_id },
          { from_id: user_id, to_id: getAuthenticatedUser().id },
        ],
        workspace_id: getAuthenticatedUser().workspace_id,
      },
      order: [['created_at', 'DESC']],
    });

    messages.forEach(msg => {
      if (msg.attachment) {
        const attachment = JSON.parse(msg.attachment);
        if (this.getAllowedImages().includes(attachment.new_name.split('.').pop())) {
          images.push(attachment.new_name);
        }
      }
    });

    return images;
  }

  // Delete conversation
  async deleteConversation(user_id) {
    try {
      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { from_id: getAuthenticatedUser().id, to_id: user_id },
            { from_id: user_id, to_id: getAuthenticatedUser().id },
          ],
          workspace_id: getAuthenticatedUser().workspace_id,
        },
      });

      for (const msg of messages) {
        if (msg.attachment) {
          const path = `storage/${JSON.parse(msg.attachment).new_name}`;
          if (Storage.exists(path)) {
            Storage.delete(path);
          }
        }
        await msg.destroy();
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  // Delete message by ID
  async deleteMessage(id) {
    try {
      const msg = await Message.findOne({
        where: { from_id: getAuthenticatedUser().id, id: id },
      });

      if (msg && msg.attachment) {
        const path = `storage/${JSON.parse(msg.attachment).new_name}`;
        if (Storage.exists(path)) {
          Storage.delete(path);
        }
      }

      if (msg) await msg.destroy();
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get user avatar URL
  async getUserAvatarUrl(userAvatarName) {
    return Storage.url(`${process.env.CHATIFY_USER_AVATAR_FOLDER}/${userAvatarName}`);
  }

  // Get attachment URL
  getAttachmentUrl(attachmentName) {
    return Storage.url(`${process.env.CHATIFY_ATTACHMENTS_FOLDER}/${attachmentName}`);
  }
}

module.exports = ChatifyMessenger;
