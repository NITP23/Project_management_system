import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MessageSquare, CheckCircle, X } from "lucide-react";
import { getAssignedStudents } from "../../store/slices/teacherSlice"

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
        break;
    }
  }


  const getStatusText = (status) => {
    if
  }

  return <></>;
};

export default AssignedStudents;
