import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MessageSquare, CheckCircle, X, Loader, Divide } from "lucide-react";
import { addFeedback, getAssignedStudents, markComplete } from "../../store/slices/teacherSlice"

const AssignedStudents = () => {
  const [sortBy, setSortBy] = useState(false);
  const [showFeedbackModel, setShowFeedbackModel] = useState(false);
  const [showCompleteModel, setShowCompleteModel] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [feedbackData, setFeedbackData] = useState({
    title: "",
    message: "",
    type: "general",
  })

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAssignedStudents());
  }, [dispatch])

  const { assignedStudents, loading, error } = useSelector((state) => state.teacher);

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border border-green-300"
        break;

      case "approved":
        return "bg-blue-100 text-blue-700 border border-blue-300"
        break;

      default:
        return "bg-yellow-100 text-yellow-700 border border-yellow-300"
    }
  }


  const getStatusText = (status) => {
    if (status === "completed") return "Completed"
    if (status === "approved") return "Approved"
    return "Pending"
  }


  const handleFeedback = (student) => {
    setSelectedStudent(student);
    setFeedbackData({
      title: "",
      message: "",
      type: "general"
    })
    setShowFeedbackModel(true)
  }

  const handleMarkComplete = (student) => {
    setSelectedStudent(student)
    setShowCompleteModel(true)
  }

  const closeModel = () => {
    setShowCompleteModel(false);
    setShowFeedbackModel(false);
    setSelectedStudent(null);
    setFeedbackData({
      title: "",
      message: "",
      type: "general"
    })
  }

  const submitFeedback = () => {
    if (selectedStudent?.project?._id && feedbackData.title && feedbackData.message) {
      dispatch(
        addFeedback({
          projectId: selectedStudent.project._id,
          payload: feedbackData,
        })
      )
      closeModel()
    }
  }

  const confirmMarkComplete = () => {
    if (selectedStudent?.project?._id) {
      dispatch(
        markComplete(selectedStudent?.project?._id)
      )
      closeModel()
    }
  }

  const sortedStudents = [...(assignedStudents || [])].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a?.user?.name.localeCompare(b?.user?.name);
        break;
      case "lastActivity":
        return new Date(b?.project?.updatedAt) - new Date(a?.project?.updatedAt);
        break;
      default:
        return 0;
    }
  })

  const stats = [
    {
      label: "Total Students",
      value: sortedStudents.length,
      bg: "bg-blue-50",
      text: "text-blue-700",
      sub: "text-blue-600",
    },
    {
      label: "Projects Completed",
      value: sortedStudents.filter(
        (s) => s.project?.status === "completed"
      ).length,
      bg: "bg-green-50",
      text: "text-green-700",
      sub: "text-green-600",
    },
    {
      label: "In Progress",
      value: sortedStudents.filter(
        (s) => s.project?.status === "approved"
      ).length,
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      sub: "text-yellow-600",
    },
    {
      label: "Total Projects",
      value: sortedStudents.length,
      bg: "bg-purple-50",
      text: "text-purple-700",
      sub: "text-purple-600",
    },
  ];


  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    )
  }

  if (error)
    return (
      <div className="text-center py-10 text-red-600 font-medium">Error loading Students</div>
    )

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">Assigned Students</h1>
            <p className="card-subtitle">Manage your assigned students and their projects</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {stats.map((item) => (
              <div key={item.label} className={`${item.bg} p-4 rounded-lg`}>
                <p className={`text-sm font-medium ${item.sub}`}>{item.label}</p>
                <p className={`text-2xl ${item.text} font-bold mt-1`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sort Control */}
        <div className="flex justify-end">
          <select
            className="input-field w-48 text-sm"
            value={sortBy || ""}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Default Order</option>
            <option value="name">Sort by Name</option>
            <option value="lastActivity">Sort by Last Activity</option>
          </select>
        </div>

        {/* Students Grid */}
        {sortedStudents.length === 0 ? (
          <div className="card text-center py-12">
            <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-1">No Students Assigned</h3>
            <p className="text-slate-500 text-sm">Students will appear here once they are assigned to you.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedStudents.map((student) => {
              const initials = (student.name || "S")
                .split(" ")
                .map((w) => w[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
              const isCompleted = student.project?.status === "completed";

              return (
                <div
                  key={student._id}
                  className="card hover:shadow-lg transition-all duration-300 border border-slate-200"
                >
                  {/* Student Info Row */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-11 h-11 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">{initials}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-slate-800 truncate">{student.name}</h3>
                      <p className="text-slate-500 text-sm truncate">{student.email}</p>
                    </div>

                    <span className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusBadge(student.project?.status)}`}>
                      {getStatusText(student.project?.status)}
                    </span>
                  </div>

                  {/* Project Info */}
                  <div className="bg-slate-50 rounded-lg p-3 mb-4">
                    <h4 className="font-medium text-slate-700 text-sm mb-1">
                      {student.project?.title || "No Project Title"}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Last Updated: {new Date(student.project?.updatedAt || new Date()).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleFeedback(student)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Give Feedback
                    </button>

                    <button
                      onClick={() => handleMarkComplete(student)}
                      disabled={isCompleted}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isCompleted
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      {isCompleted ? "Completed" : "Mark Complete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedbackModel && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Give Feedback</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  For {selectedStudent?.name} — {selectedStudent?.project?.title || "Project"}
                </p>
                <p className="text-sm text-slate-500 mt-0.5">
                  Last Updated: {new Date(selectedStudent?.project?.updatedAt || new Date()).toLocaleString()}
                </p>
              </div>
              <button onClick={closeModel} className="p-1 hover:bg-slate-100 rounded-lg transition">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Feedback Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent "
                  placeholder="Feedback title..."
                  value={feedbackData.title}
                  onChange={(e) => setFeedbackData({ ...feedbackData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Feedback Message</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Write your feedback..."
                  value={feedbackData.message}
                  onChange={(e) => setFeedbackData({ ...feedbackData, message: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Feedback Type</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={feedbackData.type}
                  onChange={(e) => setFeedbackData({ ...feedbackData, type: e.target.value })}
                >
                  <option value="general">General</option>
                  <option value="positive">Positive</option>
                  <option value="negative">Needs Improvement</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-slate-200">
              <button onClick={closeModel} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition">
                Cancel
              </button>
              <button
                onClick={submitFeedback}
                disabled={!feedbackData.title || !feedbackData.message}
                className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}





      {
        // showFeedbackModel && selectedStudent && (
        //   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModel}>

        //     <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform scale-100 transition-all " onClick={(e) => e.stopPropagation()}>

        //       <div className="p-6">
        //         <div className="flex items-center justify-between mb-6">
        //           <h2 className="text-xl font-bold text-slate-800">Provide Feedback</h2>
        //           <button onClick={closeModel} className="text-slate-400 hover:text-slate-600">
        //             <X className="w-6 h-6" />
        //           </button>
        //         </div>


        //         {/* PROJECT INFO */}
        //         <div className="bg-slate-50 rounded-lg p-4 mb-6">
        //           <div className="space-y-2 text-sm">
        //             <div>
        //               <span className="font-medium text-slate-600">Project:</span>
        //               <span className="ml-2 text-slate-800">{selectedStudent.project?.title || "No Title"}</span>
        //             </div>


        //             <div>
        //               <span className="font-medium text-slate-600">Student:</span>
        //               <span className="ml-2 text-slate-800">{selectedStudent.name}</span>
        //             </div>





        //             {
        //               selectedStudent.project?.deadline && (
        //                 <div>
        //                   <span className="font-medium text-slate-600">Deadline:</span>
        //                   <span className="ml-2 text-slate-800">{new Date(selectedStudent.project?.deadline).toLocaleDateString()}</span>
        //                 </div>
        //               )
        //             }


        //             <div>
        //               <span className="font-medium text-slate-600">Last Updated:</span>
        //               <span className="ml-2 text-slate-800">{new Date(selectedStudent.project?.updatedAt).toLocaleDateString()}</span>
        //             </div>
        //           </div>
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // )
        // }
      }






      {/* Mark Complete Confirmation Modal */}
      {showCompleteModel && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">Mark Project as Complete?</h2>
              <p className="text-sm text-slate-500">
                This will mark <strong>{selectedStudent.name}</strong>&apos;s project
                &quot;<strong>{selectedStudent.project?.title || "Untitled"}</strong>&quot; as completed.
                This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-center gap-3 p-5 border-t border-slate-200">
              <button onClick={closeModel} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition">
                Cancel
              </button>
              <button
                onClick={confirmMarkComplete}
                className="px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
              >
                Yes, Mark Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssignedStudents;

