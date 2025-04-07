import { connectDB } from './lib/db';
import { Company } from './models';

export default async function handler(req, res) {
  await connectDB();

  try {
    switch (req.method) {
      case 'GET':
        const companies = await Company.findAll({
          include: [{ model: Tax }]
        });
        return res.json(companies);

      case 'POST':
        const company = await Company.create(req.body);
        return res.status(201).json(company);

      default:
        return res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}