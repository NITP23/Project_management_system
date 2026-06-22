import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createStudents } from "../../store/slices/adminSlice";
import { toggleStudentModal } from "../../store/slices/popupSlice";
import {X} from "lucide-react"

const AddStudent = () => {
  const dispatch =  useDispatch();
  // const {isCreateStudentModalOpen} = useSelector(state => state.popup);
   
  const [formData,setFormData] = useState({
    name : "",
    email : "",
    department : "",
    password : "",
  });

  // Reset form when modal opens
  // useEffect(() => {
  //   if(isCreateStudentModalOpen) {
  //     setFormData({
  //       name : "",
  //       email : "",
  //       department : "",
  //       password : "",
  //     });
  //   }
  // }, [isCreateStudentModalOpen]);

    const handleCreateStudent = (e) => {
      e.preventDefault();
      dispatch(createStudents(formData));
      setFormData({name:"", email:"", department : "", password : ""})
      dispatch(toggleStudentModal());
    }


  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Add Student
                  </h3>
                  <button onClick={() => dispatch(toggleStudentModal())} className="text-slate-400 hover:text-slate-600">
                    <X className="w-6 h-6"/>
                  </button>
                </div>

                <form onSubmit={handleCreateStudent} className="space-y-4" action="">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input-field w-full py-1 border-b border-slate-600 focus: outline-none"/>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email 
                    </label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="input-field w-full py-1 border-b border-slate-600 focus:outline-none"/>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Password 
                    </label>
                    <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="input-field w-full py-1 border-b border-slate-600 focus:outline-none"/>
                  </div>

                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Department 
                    </label>


                    <select className="input-field w-full py-2 border-b border-slate-600 focus: outline-none" required value={formData.department || ""} onChange={(e) => setFormData({...formData, department: e.target.value})}>
                      <option value="" disabled>Select Department</option>
                      <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                      <option value="Software Engineering">Software Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Electronic & Communication Engineering">Electronic & Communication Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Business Administration">Business Administration</option>
                      <option value="Architecture">Architecture</option>
                    </select>

                    {/* <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="input-field w-full py-1 border-b border-slate-600 focus: outline-none"/>  */}
                  </div>



                  <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={() => dispatch(toggleStudentModal())} className="btn-danger">Cancel</button>


                    <button type="submit" className="btn-primary">Add Student</button>


                  </div>


                </form>
                
              </div>
            </div>
    </>
  );
};

export default AddStudent;
