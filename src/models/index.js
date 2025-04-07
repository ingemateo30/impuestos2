import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

export const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user'
  }
});

export const Company = sequelize.define('Company', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nit: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  phone: DataTypes.STRING(20),
  address: DataTypes.TEXT
});

export const Tax = sequelize.define('Tax', {
  type: {
    type: DataTypes.ENUM('retencion', 'iva', 'renta', 'ica', 'otro'),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: DataTypes.FLOAT,
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'overdue'),
    defaultValue: 'pending'
  }
});

// Relaciones
Company.hasMany(Tax, { foreignKey: 'companyId' });
Tax.belongsTo(Company, { foreignKey: 'companyId' });