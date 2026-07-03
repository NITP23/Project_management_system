import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowDownToLine, File, FileArchive, FileSpreadsheet, FileText, Layout, LayoutGrid, List } from "lucide-react";
import { downloadTeacherFile, getFiles } from "../../store/slices/teacherSlice";
import { toast } from "react-toastify";

const TeacherFiles = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");



  const dispatch = useDispatch();
  const filesFromStore = useSelector((state) => state.teacher.files) || [];

  useEffect(() => {
    dispatch(getFiles())
  }, [])

  const deriveTypeFormatName = (name) => {
    if (!name) return "Other";
    const parts = name.split(".");
    if (parts.length === 1)
      return (parts[parts.length - 1] || "").toLowerCase();

  }


  const normalizeFile = (f) => {
    const type = deriveTypeFormatName(f.originalName) || f.fileType || "other";
    let category = "other"

    if (["pdf", "doc", "docx", "txt"].includes(type)) {
      category = "report";
    }
    else if (["ppt", "pptx", "keynotes"].includes(type)) {
      category = "presentation"
    }
    else if (["zip", "rar", "7z", "iso"].includes(type)) {
      category = "code"
    }
    else if (["js", "ts", "html", "css", "json",].includes(type)) {
      category = "code";
    }
    else if (["mp4", "mpeg", "mov", "avi"].includes(type)) {
      category = "video";
    }
    else if (["mp3", "wav", "ogg"].includes(type)) {
      category = "audio";
    }
    else if (["jpg", "jpeg", "png", "gif", "svg", "avif"].includes(type)) {
      category = "image";
    }

    return {
      id: f._id,
      name: f.originalName,
      type: type.toUpperCase(),
      size: f.size || "-",
      student: f.studentName || "-",
      uploadDate: f.uploadedAt || f.createdAt || new Date().toISOString(),
      category,
      projectId: f.projectId || f.project?._id,
      fileId: f._id,
    }
  }


  const files = useMemo(
    () => (filesFromStore || []).map(normalizeFile),
    [filesFromStore]
  )

  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="w-8 h-8 text-red-500" />;

      case "doc":
      case "docx":
        return <FileText className="w-8 h-8 text-blue-500" />;

      case "ppt":
      case "pptx":
        return <FileSpreadsheet className="w-8 h-8 text-orange-500" />;

      case "zip":
      case "rar":
        return <FileArchive className="w-8 h-8 text-yellow-500" />;

      default:
        return <File className="w-8 h-8 text-slate-500" />;
    }
  };

  const filteredFiles = files.filter(file => {

    const matchesType = filterType === "all" ? true : file.category === filterType;

    const matchesSearch = file.name?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesType && matchesSearch;

  })


  const handleDownloadFile = async (file) => {

    try {
      const res = await dispatch(
        downloadTeacherFile({ projectId: file.projectId, fileId: file.id })
      ).unwrap()
      const fileUrl = res.fileUrl || file.fileUrl;
      window.open(fileUrl, "_blank");
      toast.success("File downloaded successfully");
    }
    catch (error) {
      console.error("Error downloading file", error);
      toast.error("Failed to download file please try again");
    }

  }

  const fileStats = [
    {
      label: "Total Files",
      count: files.length,
      bg: "bg-blue-50",
      text: "text-blue-600",
      value: "text-blue-700",
    },
    {
      label: "Reports",
      count: files.filter((f) => f.category === "report").length,
      bg: "bg-green-50",
      text: "text-green-600",
      value: "text-green-700",
    },
    {
      label: "Presentations",
      count: files.filter((f) => f.category === "presentation").length,
      bg: "bg-orange-50",
      text: "text-orange-600",
      value: "text-orange-700",
    },
    {
      label: "Code Files",
      count: files.filter((f) => f.category === "code").length,
      bg: "bg-purple-50",
      text: "text-purple-600",
      value: "text-purple-700",
    },
    {
      label: "Images",
      count: files.filter((f) => f.category === "image").length,
      bg: "bg-pink-50",
      text: "text-pink-600",
      value: "text-pink-700",
    },
  ];

  const tableHeadData = [
    "File Name",
    "Student",
    "Type",
    "Upload Date",
    "Actions",
  ];

  return <>
    <div className="space-y-6">
      {/* HEADER */}
      <div className="card">
        <div className="card-header">
          {/* <div className="flex justify-between items-center"> */}
          <h1 className="card-title">Student Files</h1>
          <p className="card-subtitle">Manage files shared recieved from students</p>
          {/* </div> */}
        </div>

        <div className="flex flex-cols sm:flow-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input w-56"
            >
              <option value="all">All Files</option>
              <option value="report">Reports</option>
              <option value="presentation">Presentations</option>
              <option value="code">Code</option>
              <option value="image">Images</option>
            </select>

            <input type="text" className="input w-96" placeholder="Search files by name, student or type..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          <div className="flex items-center gap-2">
            <button className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "hover:bg-slate-100 text-slate-600"}`} onClick={() => setViewMode("grid")}>
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button className={`p-2 rounded-lg ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "hover:bg-slate-100 text-slate-600"}`} onClick={() => setViewMode("list")}>
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>



        {/* File Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6 px-6 pb-6">
          {fileStats.map((item, i) => (
            <div key={i} className={`${item.bg} p-4 rounded-lg`}>
              <p className={`text-sm font-medium ${item.text}`}>{item.label}</p>
              <p className={`${item.value} text-2xl font-bold mt-1`}>{item.count}</p>
            </div>
          ))}
        </div>

      </div>


      {/* FILES DISPLAY */}

      {
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {
              filteredFiles.map((file) => (
                <div key={file.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex flex-col items-center text-center ">
                    <div className="mb-2">{getFileIcon(file.type)}</div>
                    <h3 className="font-medium text-slate-800 mb-1 w-full truncate">{file.name}</h3>
                    <p className="text-sm text-slate-600 mb-1">{file.student}</p>
                    <p className="text-xs text-slate-500 mb-1">{file.size}</p>
                    <p className="text-xs text-slate-500 mb-4">{new Date(file.uploadDate).toLocaleDateString()} </p>

                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleDownloadFile(file)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                    >
                      <ArrowDownToLine className="w-4 h-4" size={22} />
                      Download
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="min-w-full border bottom-4order-slate-200 font-semibold">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  {
                    tableHeadData.map((t) => {
                      return (
                        <th className="py-3 px-4 text-left font-semibold">{t}</th>
                      )
                    })
                  }
                </tr>
              </thead>

              <tbody>
                {
                  filteredFiles.map(file => {
                    return (
                      <tr key={file.id} className="border-t hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 items-center gap-3">
                          {getFileIcon(file.type)}{" "}
                          <span className="font-medium">{file.name}</span>
                        </td>
                        <td className="py-3 px-4">{file.student}</td>
                        <td className="py-3 px-4">{file.type}</td>
                        <td className="py-3 px-4">
                          {new Date(file.uploadedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            className="btn-primary btn-small"
                            onClick={() => handleDownloadFile(file)}
                          >Download</button>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>{""}
          </div>
        )
      }


    </div>
  </>;
};

export default TeacherFiles;
