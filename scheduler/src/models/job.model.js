import { DataTypes } from 'sequelize';
import sequelize from '../utils/db.js';

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  cron: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Standard Cron expression (e.g. 0 0 * * *)'
  },
  targetUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'The microservice URL to call'
  },
  method: {
    type: DataTypes.ENUM('GET', 'POST', 'PUT', 'DELETE'),
    defaultValue: 'POST'
  },
  payload: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'The data to send in the request'
  },
  headers: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Custom headers like API keys'
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

export default Job;
