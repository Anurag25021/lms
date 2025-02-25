import Course from "../models/course.js";

// Get all courses
export const getAllCourse = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true })
            .select(['-courseContent', '-enrolledStudents'])
            .populate({ path: 'educator', select: 'name email' }); // Limit educator fields

        res.json({ success: true, courses }); // ✅ Fixed missing response
    } catch (error) {
        res.status(500).json({ success: false, message: error.message }); // ✅ Use correct status code
    }
};

// Get course by ID
export const getCourseId = async (req, res) => {
    const { id } = req.params;

    try {
        const courseData = await Course.findById(id)
            .populate({ path: 'educator', select: 'name email' });

        if (!courseData) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Convert to plain JS object to avoid modifying the actual DB document
        const sanitizedCourse = courseData.toObject();

        if (sanitizedCourse.courseContent) {
            sanitizedCourse.courseContent.forEach(chapter => {
                if (chapter.chapterContent) {
                    chapter.chapterContent.forEach(lecture => {
                        if (!lecture.isPreviewFree) {
                            lecture.lectureUrl = ""; // Hide non-preview lectures
                        }
                    });
                }
            });
        }

        res.json({ success: true, courseData: sanitizedCourse }); // ✅ Send sanitized version
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
