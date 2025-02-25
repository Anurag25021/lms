import { clerkClient } from '@clerk/express';
import Course from '../models/course.js';
import { v2 as cloudinary } from 'cloudinary';
import { Purchase } from '../models/purchase.js';
import User from '../models/User.js'; // Ensure User model is imported

// Update Role to Educator
export const updateRoleToEducator = async (req, res) => {
    try {
        const userId = req.auth.userId;

        await clerkClient.users.updateUser(userId, {
            publicMetadata: { role: 'educator' }
        });

        res.json({ success: true, message: 'You can publish a course now' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add New Course
export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body;
        const imageFile = req.file;
        const educatorId = req.auth.userId;

        if (!imageFile) {
            return res.status(400).json({ success: false, message: 'Thumbnail not attached' });
        }

        let parsedCourseData;
        try {
            parsedCourseData = JSON.parse(courseData);
        } catch (error) {
            return res.status(400).json({ success: false, message: "Invalid course data format" });
        }

        parsedCourseData.educator = educatorId;
        const newCourse = await Course.create(parsedCourseData);

        let imageUpload;
        try {
            imageUpload = await cloudinary.uploader.upload(imageFile.path);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Failed to upload image" });
        }

        newCourse.courseThumbnail = imageUpload.secure_url;
        await newCourse.save();

        res.json({ success: true, message: 'Course Added' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({ educator });
        res.json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Educator Dashboard
export const educatorDashboardData = async (req, res) => {
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({ educator });
        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);

        // Earnings Calculation
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        });

        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

        // Fetch all students in one query
        const allStudentIds = courses.flatMap(course => course.enrolledStudents);
        const students = await User.find({ _id: { $in: allStudentIds } }, 'name imageUrl');

        const enrolledStudentsData = courses.map(course => ({
            courseTitle: course.courseTitle,
            students: students.filter(student => course.enrolledStudents.includes(student._id))
        }));

        res.json({
            success: true,
            dashboardData: { totalEarnings, enrolledStudentsData, totalCourses }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Enrolled Student Data
export const getEnrolledStudentData = async (req, res) => {
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({ educator });
        const courseIds = courses.map(course => course._id);

        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }));

        res.json({ success: true, enrolledStudents });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
