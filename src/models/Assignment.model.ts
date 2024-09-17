// import pool from '../config/db';

// export interface Assignment {
//   id?: number;
//   learnerId: number;
//   assessmentId: number;
//   assignedAt?: Date;
//   groupId?: number;
// }

// export const createAssignment = async (assignment: Assignment): Promise<Assignment> => {
//   const [result] = await pool.query('INSERT INTO assignments SET ?', assignment);
//   return { id: (result as any).insertId, ...assignment };
// };

import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import { Assessment } from "./Assessment.model";

export class Assignment extends Model {}

Assignment.init(
  {
    learnerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    assessmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Assessment,
        key: "id",
      },
    },
    assignedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Assignment",
    tableName: "assignments",
    timestamps: true,
  }
);

Assignment.belongsTo(Assessment, { foreignKey: "assessmentId" });
