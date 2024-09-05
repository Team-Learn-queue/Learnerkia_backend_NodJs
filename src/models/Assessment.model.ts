// import pool from '../config/db';

// export interface Assessment {
//   id?: number;
//   question: string;
//   answer: string;
//   contentId: number;
//   createdAt?: Date;
// }


import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';
import { Content } from './Content.model';

interface AssessmentAttributes {
  id?: number;
  question: string;
  answer: string;
  contentId: number;
}

interface AssessmentCreationAttributes extends Optional<AssessmentAttributes, 'id'> {}

export class Assessment extends Model<AssessmentAttributes, AssessmentCreationAttributes>
  implements AssessmentAttributes {
  public id!: number;
  public question!: string;
  public answer!: string;
  public contentId!: number;
}


// export class Assessment extends Model {
//   id: any;
// };

Assessment.init({
  question: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
  answer: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
  contentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Content,
      key: 'id',
    },
  }
}, {
  sequelize,
  modelName: "Assessment",
  tableName: "assessments",
  timestamps: true,
})

Assessment.belongsTo(Content, { foreignKey: 'contentId' });
