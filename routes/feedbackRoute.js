import express from "express";
import Feedback from "../models/feedbackModel.js";

const feedbackRouter = express.Router();

// Feedback route
feedbackRouter.post("/send", async (req, res) => {
  const { feedback, email } = req.body;

  try {
    // Save the feedback to the database
    const newFeedback = new Feedback({ email, feedback });
    await newFeedback.save();

    res
      .status(200)
      .json({ success: true, message: "Feedback saved successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error saving feedback" });
  }
});

export default feedbackRouter;
