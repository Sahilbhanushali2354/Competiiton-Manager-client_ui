import { ChangeEvent, useEffect, useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Spin,
  message,
  notification,
} from "antd";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { loginInputs } from "../input.types";
import { doc, getDoc } from "firebase/firestore";
import { FStore, auth } from "../configs/firebase.config";
import "../index.css";
import back from "../assets/images/pexels-eberhard-grossgasteiger-2310713.jpg";
import { useRecoilState } from "recoil";
import { AtomData } from "../store/atom.store";

const Login = () => {
  const navigate = useNavigate();

  // const handleClick = () => {
  //   navigate("/");
  // };

  useEffect(() => {
    const x = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      } else {
        navigate("/login");
      }
    });

    return () => x();
  }, [navigate]);

  //   if (user) {
  //     // User is signed in, see docs for a list of available properties
  //     // https://firebase.google.com/docs/reference/js/auth.user
  //     // const uid = user.uid;
  //     // console.log("-------uid", uid);
  //     navigate("/");
  //     // ...
  //   } else {
  //     // User is signed out
  //     // ...
  //   }
  // });
  const [name, setName] = useRecoilState(AtomData);
  const [errorMessage, setErrorMessage] = useState<loginInputs>(
    {} as loginInputs
  );
  // const [user, setUser] = useRecoilState(AtomUser);
  const [loader, setLoader] = useState(false);

  // const [AuthUser, setAuthUser] = useState<loginInputs>();

  const handlelogin = () => {
    console.log("--------1st");
    let _err = { ...errorMessage };
    // console.log("----erroremail", errorMessage);
    // console.log("----errorpass", errorMessage.pass);
    if (!name.email) _err = { ..._err, ["email"]: "Enter Your Valid Email" };

    if (!name.pass) _err = { ..._err, ["pass"]: "Enter Your Valid Password" };
    if (name.email) _err = { ..._err, ["email"]: "" };
    setErrorMessage(_err);
    if (name.pass) _err = { ..._err, ["pass"]: "" };
    setErrorMessage(_err);
    if (name.email && !name.pass)
      _err = { ..._err, ["pass"]: "Enter Password" };
    if (!errorMessage || !name.email || !name.pass) {
      return null;
    }
    setLoader(true);
    console.log("------AUTH", auth);
    signInWithEmailAndPassword(auth, name.email, name.pass)
      .then((res) => {
        // Signed in
        console.log("------usercredential", res.user.email);
        // console.log("----name.email", name.email);

        const user = res.user;
        // console.log("-------emaildis", user.email);

        getDoc(doc(FStore, "USERS", user.uid)).then((/* res */) => {
          // console.log(res.data());

          // const userData = res.data() as UserDTO;
          // setUser(userData);
          setLoader(false);
          navigate("/");
          console.log("-----2click");
          message.open({
            content: "Login SuccessFully",
            type: "success",
            duration: 1,
          });
        });
      })

      .catch((error) => {
        const errormessage = error.message;
        notification.open({ message: errormessage, type: "error" });
        setLoader(false);
      });
  };

  const handlekeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log("helllllo", e.key);
      let _err = { ...errorMessage };
      // console.log("----erroremail", errorMessage);
      // console.log("----errorpass", errorMessage.pass);
      if (!name.email) _err = { ..._err, ["email"]: "Enter Your Valid Email" };

      if (!name.pass) _err = { ..._err, ["pass"]: "Enter Your Valid Password" };
      if (name.email) _err = { ..._err, ["email"]: "" };
      setErrorMessage(_err);
      if (name.pass) _err = { ..._err, ["pass"]: "" };
      setErrorMessage(_err);
      if (name.email && !name.pass)
        _err = { ..._err, ["pass"]: "Enter Password" };
      if (!errorMessage || !name.email || !name.pass) {
        return null;
      }
      setLoader(true);
      console.log("------AUTH", auth);
      signInWithEmailAndPassword(auth, name.email, name.pass)
        .then((res) => {
          // Signed in
          console.log("------usercredential", res.user.email);
          // console.log("----name.email", name.email);

          const user = res.user;
          // console.log("-------emaildis", user.email);

          getDoc(doc(FStore, "USERS", user.uid)).then((/* res */) => {
            // console.log(res.data());

            // const userData = res.data() as UserDTO;
            // setUser(userData);
            setLoader(false);
            navigate("/");
            console.log("-----2click");
            message.open({
              content: "Login SuccessFully",
              type: "success",
              duration: 1,
            });
          });
        })

        .catch((error) => {
          const errormessage = error.message;
          notification.open({ message: errormessage, type: "error" });
          setLoader(false);
        });
    }
  };

  // console.log({ user });

  const handlechange = (e: ChangeEvent<HTMLInputElement>) => {
    let name1 = e.target.name;
    let val = e.target.value;

    setName({ ...name, [name1]: val });

    // if (val) setErrorMessage({ ...errorMessage, ["email"]: "" });

    if (!val.match(/@gmail.com/))
      setErrorMessage({
        ...errorMessage,
        ["email"]: "Enter Valid Email Address",
      });
    else setErrorMessage({ ...errorMessage, [name1]: "" });
    if (!val)
      setErrorMessage({
        ...errorMessage,
        [name1]: "Enter Valid Password",
      });
    else setErrorMessage({ ...errorMessage, [name1]: "" });
  };

  return (
    <div>
      <div
        className="main-container"
        style={{
          height: "100%",
          width: "100%",
          position: "fixed",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: `url(${back})`,
          // backgroundColor: "#8B9AB7",
        }}
      >
        <div
          className="sub-container"
          style={{
            height: "50%",
            width: "50%",
            position: "fixed",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ padding: "40px" }}>
            <h1 style={{ color: "white" }}>Login Form</h1>
          </div>

          <Form.Item name="email">
            <Input
              name="email"
              onChange={handlechange}
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
              style={{ width: "300px" }}
              onKeyDown={handlekeydown}
            />
            <div style={{ color: "red" }}>{errorMessage.email}</div>
          </Form.Item>
          <Form.Item name="password">
            <Input
              onKeyDown={handlekeydown}
              name="pass"
              onChange={handlechange}
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              style={{ width: "300px" }}
            />
            <div style={{ color: "red" }}>{errorMessage.pass}</div>
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>
                <label style={{ color: "black" }}>Remember me</label>
              </Checkbox>
            </Form.Item>

            <a
              className="login-form-forgot"
              style={{ color: "#313236", textDecorationLine: "underline" }}
            >
              <span
                style={{ padding: "10px", fontSize: "16px" }}
                onClick={() => navigate("/forgotPassword")}
              >
                Forgot Password
              </span>
            </a>
          </Form.Item>

          <Form.Item style={{ display: "flex", justifyContent: "center" }}>
            <Spin
              spinning={loader}
              style={{ borderRadius: "100px" }}
              size="default"
            >
              <Button
                size="large"
                style={{ width: "10rem" }}
                type="primary"
                htmlType="submit"
                className="login-form-button"
                onClick={handlelogin}
              >
                Log in
              </Button>
            </Spin>
            <label style={{ padding: "10px", fontSize: "15px" }}>OR</label>
            <a
              style={{ color: "#313236", textDecorationLine: "underline" }}
              onClick={() => navigate("/userRegister")}
            >
              <span style={{ padding: "10px", fontSize: "16px" }}>
                Register Now
              </span>
            </a>
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default Login;
