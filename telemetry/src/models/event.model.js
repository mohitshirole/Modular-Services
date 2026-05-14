import { DataTypes } from 'sequelize';
import sequelize from '../utils/db.js';

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  appId: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'The application initiating the request (e.g., CRM, Dashboard)'
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'The user ID from Identity module'
  },
  service: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'The microservice used (e.g., PDF-Engine, Tally-Gateway)'
  },
  event: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Specific action performed (e.g., RENDER_PDF, SYNC_TALLY)'
  },
  status: {
    type: DataTypes.ENUM('SUCCESS', 'FAILED', 'PENDING'),
    defaultValue: 'SUCCESS'
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Time taken in milliseconds'
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Extra details like row counts, file sizes, etc.'
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['appId'] },
    { fields: ['userId'] },
    { fields: ['service'] },
    { fields: ['createdAt'] }
  ]
});

export default Event;
