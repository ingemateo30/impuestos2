import NextAuth from 'next-auth';
import { SequelizeAdapter } from '@auth/sequelize-adapter';
import { connectDB } from '../../../lib/db';
import { Company } from '../../../models';

export default NextAuth({
  adapter: SequelizeAdapter(connectDB()),
  providers: [
    // Configura tus proveedores de autenticación aquí
  ],
  callbacks: {
    async session({ session, user }) {
      const company = await Company.findOne({ where: { email: user.email } });
      session.user.companyId = company?.id;
      return session;
    }
  }
});