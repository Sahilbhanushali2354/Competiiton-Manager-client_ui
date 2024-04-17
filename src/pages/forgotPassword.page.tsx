import { Button, Input, Switch, message } from "antd";
import { ChangeEvent, useEffect, useState, KeyboardEvent } from "react";
import { ForgotPasswordDTO } from "../types/input.type";
import { onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../common/config/firebase/firebase.config";
import {
  AtomPeopleData,
  AtomTheme,
  FieldsAtom,
} from "../store/atom/atom.store";
import { useRecoilState, useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";

import {
  Container1,
  ErrorMessage,
  FormImage,
  GridContainer,
  InputDiv,
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
  const peopleData = useRecoilValue(AtomPeopleData);

  useEffect(() => {
    if (!fields.email?.length || !peopleData.length) {
      return navigate("/login");
    }
  }, []);
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
        email: "Enter Email",
      });
    } else if (!peopleData.some((person) => person.email === fields.email)) {
      setErrorMessage({
        ...errorMessage,
        email: "Email does not exist",
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
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
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
                  <Logo src={logo} />
                  <Title>Reset Your Password</Title>
                </Header>

                <div style={{ padding: "7px" }}></div>
                <InputDiv>
                  <div>Email</div>
                  <Input
                    onKeyDown={handleKeydown}
                    type="email"
                    name="email"
                    placeholder="Enter Your Email"
                    onChange={handleChange}
                    value={fields.email}
                  />
                  <ErrorMessage>{errorMessage.email}</ErrorMessage>
                </InputDiv>

                <div>
                  <SendEmailButton onClick={handleSubmit}>
                    SEND EMAIL
                  </SendEmailButton>
                  <Button type="link" onClick={() => navigate("/login")}>
                    BACK TO LOGIN
                  </Button>
                </div>
              </LoginForm>
            </Container1>
          </GridContainer>
        </SubContainer>
      </MainContainer>
    </ThemeProvider>
  );
};

export default Forgotpassword;
