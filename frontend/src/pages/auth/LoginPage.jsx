import { useEffect, useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BookOpen, Loader } from "lucide-react";
import { login } from "../../store/slices/authSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const {isLoggingIn, authUser} = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    "email": "",
    "password": "",
    "role": "Student",
  });

  const [errors, setErrors] = useState({})
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }))

    if(errors[name]){
      setErrors((prev) => ({...prev, [name]: ""}))
    }
  }

  const validateForm = () => {
    const newErrors = {};
    const email = (formData.email || "").trim();
    if(!email){
      newErrors.email = "Email is required";
    }
    else if(!/\S+@\S+\.\S+/.test(email)){
      newErrors.email = "Email is invalid";
    }
    if(!formData.password){
      newErrors.password = "Password is required";
    }
    else if(formData.password.length < 8){
      newErrors.password = "Password must be at least 8 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    // const data = new FormData();
    // data.append("email", formData.email);
    // data.append("password", formData.password);
    // data.append("role", formData.role);
    // send trimmed email to backend
    dispatch(login({
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role,
    }));
  }

  useEffect(() => {
    if(authUser){
      switch(authUser.role){
        case "Student":
          navigate("/student");
          break;
        case "Teacher":
          navigate("/teacher");
          break;
        case "Admin":
          navigate("/admin");
          break;  
        default:
          navigate("/login");
      }
    }
  }, [authUser, navigate])

  return (
    <>
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="max-w-md w-full">
        {/* header  */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-500 ">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Educational Project Management </h1>
          <p className="text-slate-600 mt-2">Sign in to your account</p>
        </div>
        {/* Login form  */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {
              errors.general && (
              <div className= "p-3 bg-red-50 border border-red-200  rounded-lg">
              <p className = "text-sm text-red-600">{errors.general}</p>
              </div>
            )}



            {/* {role} */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input"
              >
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* Email Adress */}
            <div className = "">
              <label className="label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className = {`input ${errors.email ? "input-error" : ""}`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className = "">
              <label className="label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className = {`input ${errors.password ? "input-error" : ""}`}
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            {/* Forgot Password */}
            <div className="text-sm text-right">
              <Link to="/forgot-password" className="text-blue-600 hover:underline">Forgot your password?</Link>
            </div>

            {/* Submit Button */}
              <button
                type="submit"
                className="w-full btn btn-primary disabled:opacity-50 cursor-not-allowed"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <div className="flex items-center justify-center">
                    <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"/> Signing In...
                  </div>
                ) : "Sign In"}
              </button>
          </form>
        </div>
      </div>
    </div>
  </>);
};

export default LoginPage;
