const clientService = require('../services/authClientService');
const roleService = require('../services/roleService');
const ModelRole = require('../../models/ModelRole'); // Replace with your role model if applicable

class ClientController {
  //Create Client.
  async createClient(req, res) {
    try {
      const client = await clientService.createClient(req);

      // Example: Add client-role association if needed
      const role = 'client';
      const role_id = await roleService.getRoleIdByName(role); // Assuming this is implemented
      const model_id = client.id;
      const model_type = role;
      await ModelRole.create({ model_id, model_type, role_id });

      res.status(201).json({ message: 'Client created successfully', client });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  //Confirm Email if the Client email already exists in Client table.
  async confClient(req, res) {
    try {
      await clientService.confClient(req.body);
      res.status(201).json({ message: 'Available Client.' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllClients(req, res) {
    try {
      const clients = await clientService.getAllClients();
      res.status(200).json(clients);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getClientById(req, res) {
    try {
      const client = await clientService.getClientById(req.params.id);
      res.status(200).json(client);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async updateClient(req, res) {
    try {
      const data = req.body;
      if (req.file) {
        data.photo = req.file.path;
      }
      const updatedClient = await clientService.updateClient(
        req.params.id,
        data
      );
      res.status(200).json({
        message: 'Client updated successfully',
        client: updatedClient
      });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async deleteClient(req, res) {
    try {
      await clientService.deleteClient(req.params.id);
      res.status(200).json({ message: 'Client deleted successfully' });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

module.exports = new ClientController();
