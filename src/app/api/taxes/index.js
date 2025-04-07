import { connectDB } from '../../../lib/db';
import { Tax, Company } from '../../../models';

export default async function handler(req, res) {
  await connectDB();

  try {
    switch (req.method) {
      case 'GET':
        const taxes = await Tax.findAll({
          include: [{ model: Company }]
        });
        return res.json(taxes);

      case 'POST':
        const tax = await Tax.create(req.body);
        return res.status(201).json(tax);

      default:
        return res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}