import { DataTypes, Model, ModelStatic, Optional } from "sequelize";
import sequelize from "../config/db";
import { Assessment } from "./Assessment.model";

interface SubmissionAttributes {
  id?: number;
  answerText: string;
  learnerId: number;
  assessmentId: number;
  submittedFile?: string;
  comments?: string;
  score?: number;
}

interface SubmissionCreationAttributes
  extends Optional<SubmissionAttributes, "id"> {}

export class Submission
  extends Model<SubmissionAttributes, SubmissionCreationAttributes>
  implements SubmissionAttributes
{
  public id!: number;
  public answerText!: string;
  public learnerId!: number;
  public assessmentId!: number;
  public submittedFile!: string;
  public comments!: string;
  public score!: number;
}

Submission.init(
  {
    answerText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    learnerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    assessmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    submittedFile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    comments: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Submission",
    tableName: "submissions",
    timestamps: true,
  }
);

// Submission.belongsTo(Assessment, { foreignKey: "assessmentId" });
// Assessment.hasMany(Submission, { foreignKey: "assessmentId" });
