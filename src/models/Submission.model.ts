import { DataTypes, Model, ModelStatic, Optional } from 'sequelize';
import sequelize from '../config/db';
import { Assessment } from './Assessment.model';

interface AssessmentAttributes {
  id?: number;
  answerText: string;
  learnerId: number;
  assessmentId: number;
  submittedFile?: string;
  comments?: string;
  score?: number;
}

interface SubmissionCreationAttributes extends Optional<AssessmentAttributes, 'id'> {}

export class Submission extends Model<AssessmentAttributes, SubmissionCreationAttributes>
  implements AssessmentAttributes {
  public id!: number;
  public answerText!: string;
  public learnerId!: number;
  public assessmentId!: number;
  public submittedFile!: string;
  public comments!: string;
  public score!: number;
  static associate: (models: { Course: ModelStatic<Model<any, any>>; Submission: ModelStatic<Model<any, any>>; }) => void;
}



Submission.init({
  answerText: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  learnerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  assessmentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  submittedFile: {
    type: DataTypes.STRING,
    allowNull: true
  }, 
  comments: {
    type: DataTypes.STRING,
    allowNull: true
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  sequelize,
  modelName: "Submission",
  tableName: "submissions",
  timestamps: true,
})

Submission.belongsTo(Assessment, { foreignKey: 'assessmentId' });
Assessment.hasMany(Submission, { foreignKey: 'assessmentId' });