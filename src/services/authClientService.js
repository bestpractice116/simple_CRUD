const Client = require('../../models/Client');
const Project = require('../../models/Project');
const Task = require('../../models/Task');

class authClientService {
  // Create a new Client
  async createClient(req) {
    const {
      first_name,
      last_name,
      business_name,
      email,
      sex,
      preferred_correspondence_email,
      preferred_contact_method,
      business_address,
      address_line_1,
      address_line_2,
      state_province_region,
      city,
      state,
      company,
      phone,
      password,
      address,
      country,
      zip,
      postal_zip_code,
      website,
      prefer_company,
      dob,
      doj,
      signature,
      agree_terms,
      agree_update_terms,
      role
    } = req.body;
    // biome-ignore lint/style/useTemplate: <explanation>
    const full_name = first_name + ' ' + last_name;
    // Check if email already exists
    const existingClient = await Client.findOne({ where: { email } });
    if (existingClient) {
      throw new Error('Email already in use');
    }
    const photo = req.file ? req.file.path : '/src/avatars/no-image.jpg';
    // Create and return new client
    return await Client.create({
      first_name,
      last_name,
      full_name,
      business_name,
      email,
      sex,
      preferred_correspondence_email,
      preferred_contact_method,
      business_address,
      address_line_1,
      address_line_2,
      state_province_region,
      city,
      state,
      company,
      phone,
      password,
      address,
      country,
      zip,
      postal_zip_code,
      website,
      prefer_company,
      dob,
      doj,
      signature,
      agree_terms,
      agree_update_terms,
      photo,
      status: req.body.status || 0
    });
  }

  async confClient(data) {
    const { email } = data;
    console.log(email);
    // Check if email already exists
    const existingClient = await Client.findOne({ where: { email } });
    if (existingClient) {
      throw new Error('Email Already In Use.');
    }
  }

  async findClientByEmail(data) {
    const { email } = data;
    return await Client.findOne(
      { where: { email } },
      {
        include: [
          {
            model: Project,
            as: 'requestedClientProject'
          },
          {
            model: Task,
            as: 'clientTask'
          }
        ]
      }
    );
  }
  // Get all Clients
  async getAllClients() {
    return await Client.findAll({
      include: [
        {
          model: Project,
          as: 'requestedClientProject',
          attributes: ['id', 'title']
        },
        {
          model: Task,
          as: 'clientTask',
          attributes: ['id', 'title']
        }
      ]
    });
  }

  // Get a Client by ID
  async getClientById(id) {
    const client = await Client.findByPk(id, {
      include: [
        {
          model: Project,
          as: 'requestedClientProject',
          attributes: ['id', 'title']
        },
        {
          model: Task,
          as: 'clientTask',
          attributes: ['id', 'title']
        }
      ]
    });
    if (!client) {
      throw new Error('Client not found');
    }
    return client;
  }

  // Update a Client by ID
  async updateClient(id, updates) {
    const client = await this.getClientById(id);
    return await client.update(updates);
  }

  // Delete a Client by ID
  async deleteClient(id) {
    const client = await Client.getClientById(id);
    // client.removeAssignedClientProject();
    // client.removeClientTask();
    if (client.photo) {
      try {
        fs.unlinkSync(path.resolve(client.photo));
      } catch (error) {
        console.error('Error deleting avatar file:', error);
      }
    }
    return await client.destroy();
  }
}

module.exports = new authClientService();
