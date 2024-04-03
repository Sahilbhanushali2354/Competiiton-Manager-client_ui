import { Spin } from "antd";

import { useNavigate } from "react-router-dom";

const Splash = () => {
  const navigate = useNavigate();
  setTimeout(() => {
    navigate("/dashboard");
  }, 3000);
  return <Spin fullscreen spinning={true}></Spin>;
};

export default Splash;
