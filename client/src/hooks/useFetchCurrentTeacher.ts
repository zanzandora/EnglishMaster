import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

const useFetchCurrentTeacher = () => {
  const [teacher, setTeacher] = useState(null);
  const { token } = useAuth();

  useEffect(() => {

    const fetchTeacher = async () => {
      try {
        const response = await fetch("/attendance/current-teacher", {
          credentials: "include",
        });


        if (!response.ok) {
          throw new Error(`Failed to fetch teache: ${response.statusText}`);
        }

        const data = await response.json();
        setTeacher(data.teacher);
        localStorage.setItem("loggedInTeacher", JSON.stringify(data.teacher));
      } catch (err) {
        console.log(err);
        
      } 
    };

    if (token) {
      fetchTeacher();
    }
  }, [token]);

  return { teacher};
};

export default useFetchCurrentTeacher;
