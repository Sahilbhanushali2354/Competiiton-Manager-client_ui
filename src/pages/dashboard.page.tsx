import { Spin } from "antd";
import { useEffect, useState } from "react";
const Dashboard = () => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    const _currentUser = window.localStorage.getItem("auth");
    setAuthDetails(_currentUser ?? "");
    const originalText = ` Welcome ${window.localStorage.getItem("auth")}`;
    let index = 0;
    const interval = setInterval(() => {
      if (index <= originalText.length) {
        setDisplayedText(originalText.substring(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);
  const [authDetails, setAuthDetails] = useState("");
  console.log(authDetails);

  return (
    <Spin spinning={false}>
      <div>{displayedText}</div>
    </Spin>
  );
};
export default Dashboard;
