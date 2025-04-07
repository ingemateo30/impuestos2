import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

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
    allowNull: false,
    validate: { isEmail: true }
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
  description: DataTypes.TEXT,
  frequency: {
    type: DataTypes.ENUM('monthly', 'bimonthly', 'quarterly', 'yearly'),
    allowNull: false
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  reminderDays: {
    type: DataTypes.INTEGER,
    defaultValue: 7
  }
});
Company.hasMany(Tax);
Tax.belongsTo(Company);