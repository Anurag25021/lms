import Course from "../models/course.js";

//Get all courses
export const getAllCourse =async(req,res)=>{
    try{
        const courses = await Course.find({ isPublished: true })
  .select(['-courseContent', '-enrolledStudents'])
  .populate({ path: 'educator' });

    }catch(error){
        res.json({success:false,message:error.message});
    }
}
//get course by id
export const getCourseId = async (req, res) => {
    const { id } = req.params;

    try {
        const courseData = await Course.findById(id).populate({ path: 'educator' });

        if (!courseData) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        if (courseData.courseContent) {
            courseData.courseContent.forEach(chapter => {
                if (chapter.chapterContent) {
                    chapter.chapterContent.forEach(lecture => {
                        if (!lecture.isPreviewFree) {
                            lecture.lectureUrl = "";
                        }
                    });
                }
            });
        }

        res.json({ success: true, courseData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
