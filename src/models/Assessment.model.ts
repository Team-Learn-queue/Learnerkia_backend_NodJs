import { DataTypes, Model, ModelStatic, Optional } from "sequelize";
import sequelize from "../config/db";

interface AssessmentAttributes {
  id?: number;
  title: string;
  description: string;
  file?: string;
  courseId: string;
  createdBy: number;
}

interface AssessmentCreationAttributes
  extends Optional<AssessmentAttributes, "id"> {}

export class Assessment
  extends Model<AssessmentAttributes, AssessmentCreationAttributes>
  implements AssessmentAttributes
{
  public id!: number;
  public title!: string;
  public description!: string;
  public file!: string;
  public courseId!: string;
  public createdBy!: number;
  static associate: (models: {
    Course: ModelStatic<Model<any, any>>;
    Submission: ModelStatic<Model<any, any>>;
  }) => void;
}

Assessment.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Assessment",
    tableName: "assessments",
    timestamps: true,
  }
);
