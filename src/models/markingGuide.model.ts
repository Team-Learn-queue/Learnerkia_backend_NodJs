import { DataTypes, Model, ModelStatic, Optional } from "sequelize";
import sequelize from "../config/db";

interface MarkingGuideAttributes {
  id: string;
  assessmentId: string;
  question: string;
  expectedAnswer: string;
  keywords: string[];
  maxScore: number;
}

interface MarkingGuideCreationAttributes 
  extends Optional<MarkingGuideAttributes, "id"> {}

export class MarkingGuide 
  extends Model<MarkingGuideAttributes, MarkingGuideCreationAttributes>
  implements MarkingGuideAttributes 
{
  public id!: string;
  public assessmentId!: string;
  public question!: string;
  public expectedAnswer!: string;
  public keywords!: string[];
  public maxScore!: number;
}

MarkingGuide.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    assessmentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expectedAnswer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    keywords: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    maxScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "MarkingGuide",
    tableName: "marking_guides",
    timestamps: true,
  }
);
