import { decodeToken } from "@utils/decodeToken ";
import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

const useFetchCurrentTeacher = () => {
  const [teacher, setTeacher] = useState(null);
  const { token } = useAuth();

  useEffect(() => {

    const fetchTeacher = async () => {
      try {
        const decodedToken = decodeToken(token);
        const userID = decodedToken?.user_id;

        if (!token) throw new Error("No token found");
        if (!userID) {
          throw new Error("Invalid token");
        }
        
        const response = await fetch("/attendance/current-teacher", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
