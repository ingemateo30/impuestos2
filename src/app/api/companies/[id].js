import { connectDB } from '../../../../lib/db';
import { Company } from '../../../../models';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  try {
    switch (req.method) {
      case 'GET':
        const company = await Company.findByPk(id, { include: [Tax] });
        return company ? res.json(company) : res.status(404).json({ error: 'No encontrado' });

      case 'PUT':
        const [updated] = await Company.update(req.body, { where: { id } });
        return updated ? res.json(await Company.findByPk(id)) : res.status(404).json({ error: 'No encontrado' });

      case 'DELETE':
        const deleted = await Company.destroy({ where: { id } });
        return deleted ? res.status(204).end() : res.status(404).json({ error: 'No encontrado' });

      default:
        return res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}