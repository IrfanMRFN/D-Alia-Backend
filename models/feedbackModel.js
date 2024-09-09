import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // This will add createdAt and updatedAt timestamps
);

const feedback =
  mongoose.models.feedback || mongoose.model("feedback", feedbackSchema);

export default feedback;
