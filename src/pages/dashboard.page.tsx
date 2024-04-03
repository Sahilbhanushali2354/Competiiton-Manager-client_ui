import { Spin } from "antd";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../common/config/firebase/firebase.config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  useEffect(() => {
    const _currentUser = window.localStorage.getItem("auth");
    setAuthDetails(_currentUser ?? "");
  }, []);
  const navigate = useNavigate();
  // const [loader, setLoader] = useState(false);
  const [authDetails, setAuthDetails] = useState("");

  useEffect(() => {
    const x = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      }
    });

    return () => x();
  }, [navigate]);

  return (
    <Spin spinning={false}>
      <div>Welcome {authDetails}</div>
    </Spin>
  );
};
export default Dashboard;
