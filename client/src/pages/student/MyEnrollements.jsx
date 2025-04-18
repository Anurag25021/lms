import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Line } from "rc-progress";
import { useNavigate } from "react-router-dom"; // Added
import Footer from "../../components/student/Footer";

const MyEnrollments = () => {  // Fixed component name
  const { enrolledCourses, calculateCourseDuration } = useContext(AppContext);
  const navigate = useNavigate(); // Fixed `navigate` issue

  const [progressArray] = useState([
    { lectureCompleted: 2, totalLectures: 4 },
    { lectureCompleted: 1, totalLectures: 5 },
    { lectureCompleted: 3, totalLectures: 6 },
    { lectureCompleted: 4, totalLectures: 3 },
    { lectureCompleted: 0, totalLectures: 7 },
    { lectureCompleted: 5, totalLectures: 8 },
    { lectureCompleted: 6, totalLectures: 6 },
    { lectureCompleted: 2, totalLectures: 10 },
    { lectureCompleted: 4, totalLectures: 4 },
    { lectureCompleted: 3, totalLectures: 4 },
    { lectureCompleted: 7, totalLectures: 4 },
    { lectureCompleted: 1, totalLectures: 4 },
    { lectureCompleted: 0, totalLectures: 4 },
    { lectureCompleted: 5, totalLectures: 4 },
  ]);

  return (
    <>
      <div className="md:px-36 px-8 pt-10">
        <h1 className="text-2xl font-semibold">My Enrollments</h1>
        <table className="md:table-auto table-fixed w-full overflow-hidden border mt-10">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden">
            <tr>
              <th className="px-4 py-3 font-semibold truncate">Course</th>
              <th className="px-4 py-3 font-semibold truncate">Duration</th>
              <th className="px-4 py-3 font-semibold truncate">Completed</th>
              <th className="px-4 py-3 font-semibold truncate">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {enrolledCourses.map((course, index) => {
              const progress = progressArray[index] || {
                lectureCompleted: 0,
                totalLectures: 1, // Avoids division by zero
              };
              const progressPercent = (progress.lectureCompleted / progress.totalLectures) * 100;

              return (
                <tr className="border-b border-gray-500/20" key={course._id}>  {/* Fixed key */}
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
                    <img
                      src={course.courseThumbnail}
                      className="w-14 sm:w-24 md:w-28"
                      alt={`Thumbnail of ${course.courseTitle}`}
                    />
                    <div className="flex-1">
                      <p className="mb-1 max-sm:text-sm">{course.courseTitle}</p>
                      <Line
                        strokeWidth={2}
                        percent={progressPercent}
                        className="bg-gray-300 rounded-full"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 max-sm:hidden">
                    {calculateCourseDuration(course)}
                  </td>
                  <td className="px-4 py-3 max-sm:hidden">
                    {progress.lectureCompleted}/{progress.totalLectures}{" "}
                    <span>Lectures</span>
                  </td>
                  <td className="px-4 py-3 max-sm:text-right">
                    <button
                      onClick={() => navigate(`/Player/${course._id}`)}
                      className="px-3 sm:px-5 py-1.5 sm:py-2 bg-blue-600 max-sm:text-xs text-white"
                    >
                      {progressPercent === 100 ? "Completed" : "Ongoing"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};

export default MyEnrollments; // Fixed export name
