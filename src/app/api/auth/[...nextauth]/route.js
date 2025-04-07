import NextAuth from 'next-auth';
import { SequelizeAdapter } from '@auth/sequelize-adapter';
import { connectDB } from '../../../../../lib/db';
import { User } from '../../../../../models';

export const authOptions = {
  adapter: SequelizeAdapter(connectDB()),
  providers: [
    // Configurar proveedores de autenticación aquí
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.role = user.role;
      return session;
    }
  }
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);