import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema(
  {
    chapterId: { type: String, required: true },
    chapterOrder: { type: Number, required: true },
    chapterTitle: { type: String, required: true },
    chapterContent: [lectureSchema],
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    courseTitle: { type: String, required: true },
    courseDescription: { type: String, required: true },
    courseThumbnail: { type: String },
    coursePrice: { type: Number, required: true },
    isPublished: { type: Boolean, default: true },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    courseContent: [chapterSchema],
    courseRatings: [ratingSchema],
    educator: {
      type: String,
      ref: "User",
      required: true,
    },
    enrolledStudents: [
      {
        type: String,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    minimize: false,
  }
);


const ratingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: "User" },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { _id: false }
);

const CourseModel = mongoose.model("Course", courseSchema);

export default CourseModel;
