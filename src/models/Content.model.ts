import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';

interface ContentAttributes {
  id?: number;
  title: string;
  type: 'video' | 'audio' | 'document';
  data: string;
  instructorId: number;
}

interface ContentCreationAttributes extends Optional<ContentAttributes, 'id'> {}

export class Content extends Model<ContentAttributes, ContentCreationAttributes>
  implements ContentAttributes {
  public id!: number;
  public title!: string;
  public type!: 'video' | 'audio' | 'document';
  public data!: string;
  public instructorId!: number;
}

Content.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
  type: {
    type: DataTypes.ENUM('video', 'audio', 'document'),
    allowNull: false,
  }, 
  data: {
    type: DataTypes.STRING,
  },
  instructorId: {
    type: DataTypes.INTEGER,
  }
}, {
  sequelize,
  modelName: "Content",
  tableName: "contents",
  timestamps: true
});


