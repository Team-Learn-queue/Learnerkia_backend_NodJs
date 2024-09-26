import { Request, Response, NextFunction } from "express";
import { param, body, validationResult, query } from "express-validator";
import { upload } from "../utils/upload.util";


const validateMarkingGuide = [
  body("markingGuide")
    .optional()
    .bail()
    .custom((value) => {
      if (typeof value !== "object" || value === null) {
        throw new Error("Marking guide must be an object");
      }

      const { question, expectedAnswer, keywords } = value;

      if (!question || typeof question !== "string") {
        throw new Error("Marking guide must contain a valid question");
      }

      if (!expectedAnswer || typeof expectedAnswer !== "string") {
        throw new Error("Marking guide must contain a valid expectedAnswer");
      }

      if (!Array.isArray(keywords)) {
        throw new Error("Keywords must be an array of strings");
      }

      for (let keyword of keywords) {
        if (typeof keyword !== "string") {
          throw new Error("All keywords must be valid strings");
        }
      }

      return true; 
    }),
];


const validateOptionalFile = [
  (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(422).json({
          success: false,
          errors: [{ field: "file", message: "Invalid file type" }],
        });
      }
    }
    next();
  },
];

const errorResponse = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array().map((error) => ({
        field: error.type,
        message: error.msg,
      })),
    });
  }
  next();
};

export const createAssessmentValidator = [
  param("instructorId")
    .notEmpty()
    .isNumeric()
    .withMessage("Please provide the instructor ID"),

  param("courseId")
    .notEmpty()
    .isNumeric()
    .withMessage("Please provide the Course ID and as an integer"),

  body("title")
    .notEmpty()
    .isString()
    .withMessage("Please provide the title of the assessment"),

  body("question")
    .notEmpty()
    .isString()
    .withMessage("Question is a required field"),

  body("highestAttainableScore")
    .notEmpty()
    .isNumeric()
    .withMessage(
      "Please provide the highest attaniable score and as an integer"
    ),

  validateMarkingGuide,

  validateOptionalFile,

  errorResponse,
];

export const submissionValidator = [
  param("learnerId")
    .notEmpty()
    .isNumeric()
    .withMessage("Please provide the learner ID as an integer"),

  param("assessmentId")
    .notEmpty()
    .isNumeric()
    .withMessage("Please provide the assessment ID as an integer"),

  body("answerText")
    .notEmpty()
    .isString()
    .withMessage("Please provide the title of the assessment as a text"),

  validateOptionalFile,

  errorResponse,
];

export const gradeAssessmentValidator = [
  param("submissionId")
    .notEmpty()
    .isNumeric()
    .withMessage("Please provide the assessment ID as an integer"),

  param("instructorId")
    .notEmpty()
    .isNumeric()
    .withMessage("Please provide the instructor ID as an integer"),

  body("score")
    .notEmpty()
    .isNumeric()
    .withMessage("Please provide the score as an integer"),

  body("comments").optional().isString(),

  body("useAI")
    .notEmpty()
    .isBoolean()
    .withMessage(
      "Please select if you want learners' submissions to be graded automatically or manually"
    ),

  errorResponse,
];

export const viewLearnersValidator = [
  param("assessmentId")
    .notEmpty()
    .isNumeric()
    .withMessage("Please provide the assessment ID"),

  param("instructorId")
    .notEmpty()
    .isNumeric()
    .withMessage("Please provide the instructor ID as an integer"),

  errorResponse,
];
