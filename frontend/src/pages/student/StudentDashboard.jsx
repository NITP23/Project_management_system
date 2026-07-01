import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../../store/slices/studentSlice.js";
import { Link } from "react-router-dom"
import { AlarmClock, Bell, MessageCircle } from "lucide-react"

const StudentDashboard = () => {
  const dispatch = useDispatch()
  const { authUser } = useSelector(state => state.auth)
  const { dashboardStats } = useSelector(state => state.student)
  useEffect(() => {
    if (authUser?._id) {
      dispatch(fetchDashboardStats(authUser._id))
    }
  }, [dispatch, authUser?._id])

  const project = dashboardStats?.project || null
  const supervisorName = dashboardStats?.supervisorName || project?.supervisor?.name || project?.supervisorName || ""
  const upcomingDeadlines = dashboardStats?.upcomingDeadlines || [];
  const topNotifications = dashboardStats?.topNotifications || [];
  const feedbackList = dashboardStats?.feedbackNotifications?.slice(-2).reverse() || [];

  const formatDate = (dataStr) => {
    if (!dataStr) return "N/A";
    return new Date(dataStr).toLocaleDateString("en-GB",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
  }

  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case "upcoming":
  //       return "badge-pending"
  //       break;
  //     case "completed":
  //       return "badge-approved"
  //       break;
  //     case "overdue":
  //       return "badge-rejected"
  //       break;
  //     default:
  //       return "badge-pending";
  //   }
  // }
  return <>
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back,{authUser?.name || "Student"}</h1>
        <p className="text-blue-300">Here's what's happening with your project today</p>
      </div>


      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex item-center">
            <div className="p-3 bg-blue-100 rounded-lg">📘</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Project Title</p>
              <p className="text-lg font-semibold text-slate-800">{project?.title || "No project"}</p>
            </div>
          </div>
        </div>


        <div className="card">
          <div className="flex item-center">
            <div className="p-3 bg-blue-100 rounded-lg">👨‍🏫</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Supervisor  </p>
              <p className="text-lg font-semibold text-slate-800">{supervisorName || "No Supervisor"}</p>
            </div>
          </div>
        </div>






        <div className="card">
          <div className="flex item-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              ⏰
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Next Deadline</p>
              <p className="text-lg font-semibold text-slate-800">{formatDate(project?.deadline)}</p>
            </div>
          </div>
        </div>


        <div className="card">
          <div className="flex item-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              💬
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Recent Feedback</p>
              <p className="text-lg font-semibold text-slate-800">{feedbackList?.length ? formatDate(feedbackList[0].createdAt) : "No feedback yet"}</p>
            </div>
          </div>
        </div>

      </div>


      {/* Main Content grid */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">



        {/* Project overview */}

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Project Overview</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600 ">Title</label>
              <p className="text-slate-800 font-medium">{project?.title || "N/A"}</p>
            </div>



            <div>
              <label className="text-sm font-medium text-slate-600 ">Description</label>
              <p className="text-slate-800 font-medium">{project?.description || "No description provided."}</p>
            </div>


            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-600 ">Status</label>
              <span className={`inline-flex items-center px-2 py-[2px] rounded-full text-sm font-medium capitalize ${project?.status === "approved" ? "bg-green-100 text-green-800" : project?.status === "pending" ? "bg-yellow-100 text-yellow-800" : project?.status === "rejected" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}>{project?.status || "unknown"}</span>
            </div>


            <div>
              <label className="text-sm font-medium text-slate-600 " >Submission deadline</label>
              <p className="text-slate-800 font-medium">{formatDate(project?.deadline)}</p>
            </div>


          </div>
        </div>

        {/* Latest Feedback */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h2 className="card-title">Latest Feedback</h2>
            <Link to={"/student/feedback"} className="text-sm text-white cursor-pointer px-3 py-1 rounded-full font-medium bg-blue-600 transition-all duration-300 hover:bg-blue-700 ">View All</Link>
          </div>

          {
            feedbackList && feedbackList.length > 0 ? (
              <div className="space-y-4 p-4">
                {
                  feedbackList.map((feedback, index) => {
                    return (
                      <div key={index} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center sppace-x-2">
                            <MessageCircle className="w-5 h-5 text-blue-500" />

                            <h3 className="text-slate-800 font-medium" >{feedback.title || "Supervisor feedback"}</h3>
                          </div>

                          <p className="text-xs text-slate-500">{formatDate(feedback.createdAt)}</p>
                        </div>

                        <div className="text-slate-50 rounded-lg p-3 ">
                          <p className="text-slate-700 text-sm leading-relaxed">{feedback.message || "No feedback "}</p>
                        </div>



                        <div className="flex justify-between items-center mt-3">
                          <p className="text-xs text-slate-500 ">
                            {supervisorName || "suprvisor"}
                          </p>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            ) : (
              <div className="text-center py-4 ">
                <MessageCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No Feedback available yet...</p>
              </div>
            )
          }

        </div>
      </div>




      {/* Upcoming Deadlines and notification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Upcoming Deadlines</h2>
          </div>
          {
            upcomingDeadlines && upcomingDeadlines.length > 0 ? (
              <div className="space-y-3">
                {
                  upcomingDeadlines.map((d, i) => {
                    return (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <p className="text-slate-800 font-medium">{d.title || ""}</p>
                          <p className="text-slate-600 tex-sm">{formatDate(d.deadline)}</p>
                        </div>
                        <div className={`badge badge-pending capitalize font-bold`}>upcoming
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            ) : (
              <div className="text-center py-4 ">
                <AlarmClock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No upcoming deadlines yet.</p>
              </div>
            )
          }
        </div>



        {/* Recent Notification */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Notification</h2>
          </div>
          {
            topNotifications && topNotifications.length > 0 ? (
              <div className="space-y-3">
                {
                  topNotifications.map((n, i) => {
                    return (
                      <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100 ">
                        <p className="font-medium text-slate-800 ">{n.message}</p>
                        <p className="text-xs text-slate-500 mt-1">{formatDate(n.createdAt)}</p>
                      </div>
                    )
                  })
                }
              </div>
            ) : (
              <div className="text-center py-4 ">
                <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No Recent Notifications yet.</p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  </>;
};

export default StudentDashboard;
