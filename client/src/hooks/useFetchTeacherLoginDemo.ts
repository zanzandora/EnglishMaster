import { useState, useEffect } from "react";

const useFetchTeacherLoginDemo = (teacherID: number) => {
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {

    const loginTeacher = async () => {
      try {
        const response = await fetch("/attendance/login-teacher", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ teacherID }),
        });

        if (!response.ok) {
          throw new Error(`Login failed: ${response.statusText}`);
        }

        const data = await response.json();
        setTeacher(data.teacher);
        localStorage.setItem("loggedInTeacher", JSON.stringify(data.teacher));
      } catch (err) {
        console.log(err);
        
      } 
    };

    loginTeacher();
  }, [teacherID]);

  return { teacher};
};

export default useFetchTeacherLoginDemo;
