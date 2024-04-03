import { Button, Input, Switch, message } from "antd";
import { ChangeEvent, useEffect, useState } from "react";
import { ForgotPasswordDTO } from "../types/input.type";
import { onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../common/config/firebase/firebase.config";
import { AtomTheme, FieldsAtom } from "../store/atom/atom.store";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

import {
  Container1,
  ErrorMessage,
  FormImage,
  GridContainer,
  InputDiv,
  LoginButtonContainer,
  LoginForm,
  LoginImageContainer,
  Logo,
  MainContainer,
  SubContainer,
  Title,
  ToggleContainer,
  Header,
} from "./login.page";
import logo from "../assets/images/protocol zone logo.png";
import styled, { ThemeProvider, css } from "styled-components";
import { Theme } from "../theme/Theme";

const SendEmailButton = styled(Button)`
  width: 50%;
  border-radius: 20px;
  background: black;
  color: white;
  ${({ theme }) =>
    (theme as any) === "dark" &&
    css`
      background-color: green;
      color: white;
    `}
`;

const Forgotpassword = () => {
  const [fields, setFields] = useRecoilState(FieldsAtom);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<ForgotPasswordDTO>(
    {} as ForgotPasswordDTO
  );
  const [themeData, setThemeData] = useRecoilState(AtomTheme);

  useEffect(() => {
    const x = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard");
      }
    });

    return () => x();
  }, [navigate]);

  useEffect(() => {
    const x = window.localStorage.getItem("theme");
    const y = x && JSON.parse(x ?? "");
    setThemeData(y ?? Theme.dark);
  }, []);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let name = e.target.name;
    let value = e.target.value;
    setFields({ ...fields, [name]: value });
    console.log(value);
    let _error = { ...errorMessage };
    if (name === "email")
      _error = {
        ...errorMessage,
        email: name === "email" && !value ? "Enter Your Registered Email" : "",
      };
    setErrorMessage(_error);
  };

  const handleSubmit = () => {
    setLoader(false);
    if (!fields.email) {
      setErrorMessage({
        ...errorMessage,
        ["email"]: "Enter Your Registrated Email",
      });
    } else {
      sendPasswordResetEmail(auth, fields.email)
        .then(() => {
          setLoader(true);
          message.success("Email has been sent");
          navigate("/login");
        })
        .catch((error) => {
          setLoader(false);
          const errorMessage = error.message;
          message.error(errorMessage);
        });
    }
  };
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setThemeData(JSON.parse(storedTheme));
    }
  }, []);
  const toggleChange = (checked: boolean) => {
    setThemeData(checked ? Theme.dark : Theme.light);
    window.localStorage.setItem(
      "theme",
      checked ? JSON.stringify(Theme.dark) : JSON.stringify(Theme.light)
    );
  };
  return (
    <ThemeProvider theme={themeData}>
      <MainContainer spinning={loader} size="large">
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
                  <Logo src={logo} />
                  <Title>Reset Your Password</Title>
                </Header>

                <div style={{ padding: "7px" }}></div>
                <InputDiv>
                  <div>Email</div>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter Your Email"
                    onChange={handleChange}
                    value={fields.email}
                  />
                  <ErrorMessage>{errorMessage.email}</ErrorMessage>
                </InputDiv>

                <LoginButtonContainer>
                  <SendEmailButton onClick={handleSubmit}>
                    SEND EMAIL
                  </SendEmailButton>
                  <Button type="link" onClick={() => navigate("/login")}>
                    BACK TO LOGIN
                  </Button>
                </LoginButtonContainer>
              </LoginForm>
            </Container1>
          </GridContainer>
        </SubContainer>
      </MainContainer>
    </ThemeProvider>
  );
};

export default Forgotpassword;
