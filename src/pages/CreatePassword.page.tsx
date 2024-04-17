import { Input, Switch, message } from "antd";
import { ChangeEvent, useEffect, useState } from "react";
import { NewAccountErrorDTO } from "../types/input.type";
import { FStore, auth } from "../common/config/firebase/firebase.config";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/protocol zone logo.png";
import { AtomTheme, NewAccountAtom } from "../store/atom/atom.store";
import { useRecoilState } from "recoil";
import { ThemeProvider } from "styled-components";
import { Theme } from "../theme/Theme";
import { addDoc, collection } from "firebase/firestore";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { createUserWithEmailAndPassword } from "firebase/auth";

import {
  Container1,
  ErrorMessage,
  FormImage,
  GridContainer,
  Header,
  InputDiv,
  LoginButton,
  LoginForm,
  LoginImageContainer,
  Logo,
  MainContainer,
  SubContainer,
  Title,
  ToggleContainer,
} from "./login.page";
import { BackButtonContainer } from "./CreateAccount.page";
import { FaArrowLeftLong } from "react-icons/fa6";

const CreatePassword = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useRecoilState(NewAccountAtom);
  const [newPassword, setNewPassword] = useState<string>("");
  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState<NewAccountErrorDTO>(
    {} as NewAccountErrorDTO
  );
  const [themeData, setThemeData] = useRecoilState(AtomTheme);

  useEffect(() => {
    if (!fields.email) {
      navigate("createaccount");
    }
    const x = window.localStorage.getItem("theme");
    const y = x && JSON.parse(x ?? "");
    setThemeData(y ?? Theme.dark);
  }, []);
  const toggleChange = (checked: boolean) => {
    setThemeData(checked ? Theme.dark : Theme.light);
    window.localStorage.setItem(
      "theme",
      checked
        ? JSON.stringify(Theme.dark ?? "")
        : JSON.stringify(Theme.light ?? "")
    );
  };

  const handlechange = (e: ChangeEvent<HTMLInputElement>) => {
    let name = e.target.name;
    let value = e.target.value;
    setNewPassword(value);

    let _error = { ...errorMessage };

    if (name === "password")
      _error = {
        ...errorMessage,
        password:
          name === "password" && !value
            ? "Enter Password to Create Account"
            : "",
      };
    setErrorMessage(_error);
  };

  const handleCreate = async () => {
    let _error = { ...errorMessage };

    if (!newPassword.length)
      _error = { ..._error, ["password"]: "Enter new Password" };
    else {
      setLoader(true);
      await addData();
      CreateAccount();
    }
  };
  const addData = async () => {
    setLoader(true);
    await addDoc(collection(FStore, "PEOPLE"), fields);
  };

  const CreateAccount = () => {
    createUserWithEmailAndPassword(auth, fields.email as string, newPassword)
      .then((userCredential) => {
        setLoader(false);
        localStorage.setItem("auth", userCredential.user?.email as string);
        navigate("/login");
        setFields({});
        setNewPassword("");
        message.success("Account Created SuccessFully");
      })
      .catch((error) => {
        setLoader(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        message.error(`${errorCode} : ${errorMessage}`);
      });
  };

  return (
    <ThemeProvider theme={themeData}>
      <MainContainer spinning={loader}>
        <SubContainer>
          <ToggleContainer>
            <Switch
              checked={themeData.id === Theme.dark.id ? true : false}
              onChange={(checked: boolean) => toggleChange(checked)}
              style={{
                backgroundColor:
                  themeData.id === Theme.dark.id ? "grey" : "black",
              }}
            />
          </ToggleContainer>
          <GridContainer>
            <LoginImageContainer>
              <FormImage></FormImage>
            </LoginImageContainer>
            <Container1>
              <LoginForm>
                <Header>
                  <BackButtonContainer
                    style={{ color: "white", background: "black" }}
                    icon={<FaArrowLeftLong />}
                    onClick={() => navigate("/createaccount")}
                  ></BackButtonContainer>
                  <span style={{ margin: "5px" }}></span>
                  <Logo src={logo} />
                  <Title>Create Your Password</Title>
                </Header>

                <div style={{ padding: "7px" }}></div>

                <InputDiv>
                  <div>Password</div>
                  <Input.Password
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    type="password"
                    name="password"
                    placeholder="Enter Your Password"
                    onChange={handlechange}
                    value={newPassword}
                  ></Input.Password>
                  <ErrorMessage>{errorMessage.password}</ErrorMessage>
                </InputDiv>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <LoginButton onClick={handleCreate}>
                    Create Account
                  </LoginButton>
                </div>
              </LoginForm>
            </Container1>
          </GridContainer>
        </SubContainer>
      </MainContainer>
    </ThemeProvider>
  );
};

export default CreatePassword;
