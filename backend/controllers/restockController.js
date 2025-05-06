import { sendRestockEmail } from '../utils/email.js';
import RestockRequest from '../modeles/RestockRequest.js'; // Optional

export const requestRestock = async (req, res) => {
  const { brand, model, color, size, stock, supplierEmail } = req.body;

  if (!brand || !model || !color || !size || stock === undefined || !supplierEmail) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Optional: Save restock request to database
    const restockRequest = new RestockRequest({ brand, model, color, size, stock, supplierEmail });
    await restockRequest.save();

    // Send email
    await sendRestockEmail({ brand, model, color, size, stock, supplierEmail });
    res.status(200).json({ message: `Restock request sent for ${brand} ${model}` });
  } catch (error) {
    console.error('Error in restock request:', error);
    res.status(500).json({ message: 'Failed to send restock request' });
  }
};