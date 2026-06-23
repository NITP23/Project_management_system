import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTeacherRequests, acceptRequests, rejectRequests } from "../../store/slices/teacherSlice"
import { FileText } from "lucide-react";

const PendingRequests = () => {

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [loadingMap, setLoadingMap] = useState({})
  const dispatch = useDispatch();
  const { list } = useSelector(state => state.teacher)
  const { authUser } = useSelector(state => state.auth)

  useEffect(() => {
    dispatch(getTeacherRequests(authUser._id));
  }, [dispatch, authUser._id]);


  const setLoading = (id, key, value) => {
    setLoadingMap(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [key]: value
      }
    }))
  }


  const handleAccept = async (request) => {
    const id = request._id;
    setLoading(id, "accepting", true);
    try {
      await dispatch(acceptRequests(id)).unwrap();
    }
    finally {
      setLoading(id, "accepting", false);
    }
  };


  const handleReject = async (request) => {
    const id = request._id;
    setLoading(id, "rejecting", true);
    try {
      await dispatch(rejectRequests(id)).unwrap();
    }
    catch (err) {
      console.log("Rejection failed", err)
    }
    finally {
      setLoading(id, "rejecting", false);
    }
  };


  const filteredRequests = list.filter((request) => {
    console.log(request)
    const matchesSearch = (request?.student?.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      (request?.latestProject?.title || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  }) || [];


  return (
    <>
      <div className="space-y-6 ">
        {/* Header */}
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">Pending Supervision Projects</h1>
            <p className="card-subtitle">Review and respond to student supervision</p>
          </div>


          {/* Search and filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">

            <input type="text" placeholder="search by student name or project title..." className="input-field w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <select className="input-field sm:w-48" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

        </div>


        {/* Requests */}

        <div className="space-y-4">
          {
            filteredRequests.map(req => {
              const id = req._id;
              const project = req.latestProject;
              const projectStatus = project?.status?.toLowerCase() || "pending";
              const supervisorAssigned = !!project?.supervisor;
              const canAccept = projectStatus === "approved" && !supervisorAssigned;
              const lm = loadingMap[id] || {};
              let bgClass = "bg-white";
              let StatusMessage = "";

              if (projectStatus === "approved" && supervisorAssigned) {
                bgClass = "bg-blue-50 border-blue-300";
                StatusMessage = "Supervisor already assigned"
              }
              else if (projectStatus === "rejected") {
                bgClass = "bg-red-50 border-red-300";
                StatusMessage = "Project proposal rejected"
              }
              else if (projectStatus === "pending") {
                bgClass = "bg-yellow-50 border-yellow-300";
                StatusMessage = "Request pending"
              }
              return (
                <div key={id} className={`card border ${bgClass} hover:border-indigo-400 transition-all`}>
                  <div className="flex flex-col lg:flex-row justify-between ">
                    {/* INFO */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{req?.student?.name || "unknown student"}</h3>
                        <span className={`badge ${req.status === "pending" ? "badge-pending" : req.status === "accepted" ? "badge-approved" : "badge-rejected"}`}>{req.status?.charAt(0).toUpperCase() + req.status?.slice(1)} </span>
                      </div>

                      <p className="text-sm text-slate-500 mb-2">{req?.student?.email || "unknown email"}
                      </p>
                      <h4 className="font-medium text-slate-700 mb-2">{project?.title || "No Project title"}</h4>
                      <p className="text-xs text-slate-500">Submitted:{req?.createdAt ? new Date(req.createdAt).toLocaleString() : "-"}</p>

                      {
                        StatusMessage && (
                          <p className="mt-2 text-sm font-medium text-slate-700">{StatusMessage}</p>
                        )
                      }

                    </div>


                    {/* ACTIONS */}
                    {req.status === "pending" && (
                      <div className="mt-3 flex items-center gap-3 ">
                        <button
                          onClick={() => handleAccept(req)}
                          disabled={lm.accepting || !canAccept}
                          className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${canAccept ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                        >
                          {lm.accepting ? "Accepting..." : "Accept"}
                        </button>
                        <button
                          onClick={() => handleReject(req)}
                          disabled={lm.rejecting}
                          className={"px-4 py-1.5 text-sm rounded-lg font-medium transition-colors duration-200  bg-red-600 hover:bg-red-700 text-white disabled:cursor-not-allowed "}
                        >
                          {lm.rejecting ? "Rejecting..." : "Reject"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          }



          {/* NO  REQUEST*/}

          {
            filteredRequests.length === 0 && (
              <div className="card text-center py-8">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-slate-600 mb-2 font-medium text-lg"></h3>{""}

                <p className="text-slate-600">No supervision requests match your filters</p>
              </div>
            )
          }
        </div>
      </div>
    </>
  )
};

export default PendingRequests;
