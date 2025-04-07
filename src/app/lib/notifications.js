import nodemailer from 'nodemailer';
import { Company, Tax } from '../models';
import { formatDate } from '../utils/dates';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export async function checkAndSendReminders() {
  const taxes = await Tax.findAll({
    where: {
      dueDate: {
        [Sequelize.Op.between]: [
          new Date(),
          new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
        ]
      }
    },
    include: [Company]
  });

  for (const tax of taxes) {
    if (tax.Company && tax.Company.email) {
      await transporter.sendMail({
        from: `Sistema de Impuestos <${process.env.EMAIL_FROM}>`,
        to: tax.Company.email,
        subject: `Recordatorio: ${tax.name} vence el ${formatDate(tax.dueDate)}`,
        html: `
          <h2>Recordatorio de Impuesto</h2>
          <p>Empresa: ${tax.Company.name}</p>
          <p>Impuesto: ${tax.name} (${tax.type})</p>
          <p>Fecha Límite: ${formatDate(tax.dueDate)}</p>
          <p>Frecuencia: ${tax.frequency}</p>
        `
      });
    }
  }
}