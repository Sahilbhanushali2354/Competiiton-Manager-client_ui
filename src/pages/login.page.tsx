import { Button, Input, Spin, Switch, message } from "antd";
import { ChangeEvent, useEffect, useState } from "react";
import { PeopleDataDTO, UserDTO } from "../types/input.type";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { FStore, auth } from "../common/config/firebase/firebase.config";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/protocol zone logo.png";
import {
  AtomPeopleData,
  AtomTheme,
  FieldsAtom,
} from "../store/atom/atom.store";
import { useRecoilState } from "recoil";
import styled, { ThemeProvider } from "styled-components";
import loginImage from "../assets/images/Wavy_Gen-01_Single-07_prev_ui.png";
import { Theme } from "../theme/Theme";
import { collection, getDocs } from "firebase/firestore";

export const MainContainer = styled(Spin)`
  margin-top: 26%;
`;
export const SubContainer = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.color};
`;
export const Container1 = styled.div`
  display: flex;
  align-items: center;
`;

export const ToggleContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const LoginForm = styled.div`
  margin: auto;
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 1110px) {
    height: 80%;
    justify-content: flex-start;
  }
`;

export const FormImage = styled.img``;

export const Header = styled.div`
  display: flex;
  align-items: center;
`;

export const Logo = styled.img`
  margin-right: 10px;
  border-radius: 15px;
  width: 30px;
`;

export const Title = styled.h2`
  margin: 0;
`;

const LinkText = styled(Link)`
  margin-right: 10px;
`;

export const InputDiv = styled.div`
  margin-bottom: 10px;
`;

export const ErrorMessage = styled.div`
  color: red;
  font-size: 12px;
`;

const ForgotPasswordLink = styled(Link)`
  display: flex;
  justify-content: flex-end;
`;
export const GridContainer = styled.div`
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;

  @media (max-width: 1110px) {
    grid-template-columns: 1fr;
  }
`;

export const LoginImageContainer = styled.div`
  background-image: url(${loginImage});
  background-size: cover;
  bacground-position: center;

  @media (max-width: 1110px) {
    height: 120%;
  }
`;
export const LoginButton = styled(Button)`
  width: 100%;
  border-radius: 20px;
  background: black;
  color: white;
`;
export const LoginButtonContainer = styled.div``;

const Login = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [fields, setFields] = useRecoilState(FieldsAtom);
  const [errorMessage, setErrorMessage] = useState<UserDTO>({} as UserDTO);
  const [themeData, setThemeData] = useRecoilState(AtomTheme);
  const [poepleData, setPeopleData] = useRecoilState(AtomPeopleData);

  useEffect(() => {
    const x = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard");
      }
    });

    return () => x();
  }, [navigate]);

  useEffect(() => {
    getPeopleData();
  }, []);
  useEffect(() => {
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
    ); // Set theme item in localStorage
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
    let _error = { ...errorMessage };
    if (name === "email" || name === "password")
      _error = {
        ...errorMessage,
        email: name === "email" && !value ? "Enter Your Email" : "",
        password: name === "password" && !value ? "Enter Your password" : "",
      };
    setErrorMessage(_error);
  };

  const handleLogin = () => {
    setLoader(true);
    let _error = { ...errorMessage };
    if (!fields.email) {
      setLoader(false);
      _error = { ..._error, ["email"]: "Enter Your Email" };
    } else {
      _error = { ..._error, ["email"]: "" };
    }
    setLoader(true);
    if (!fields.password) {
      setLoader(false);
      _error = { ..._error, ["password"]: "Enter Your password" };
    } else {
      const _userExists = poepleData.some(
        (person) => person.email == fields.email
      );
      if (!_userExists) {
        setLoader(false);
        _error = { ..._error, ["email"]: "Email does not exist" };
        setErrorMessage(_error);
        return;
      }
      setFields({});
      signin();
    }
    setErrorMessage(_error);
  };

  const signin = () => {
    signInWithEmailAndPassword(
      auth,
      fields.email as string,
      fields.password as string
    )
      .then((userCredential) => {
        const user = userCredential.user;
        window.localStorage.setItem("auth", user.email ?? "");
        // setAuthDetails(user.email as string);
        console.log("---------user", user);
        message.success("Login SuccessFully");
      })
      .catch((error) => {
        setLoader(false);
        const errorMessage = error.message;
        message.error(errorMessage);
      });
  };

  const getPeopleData = async () => {
    let x: PeopleDataDTO[] = [];
    const querySnapshot = await getDocs(collection(FStore, "PEOPLE"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      const data = doc.data();
      data.id = doc.id;
      x.push(data);
    });
    setPeopleData(x);
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
                  <Title>Welcome</Title>
                </Header>
                <div>
                  <LinkText to="/login">Create a free account</LinkText>
                  <span>or log in to get started with TechFiesta</span>
                </div>
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
                <InputDiv>
                  <div>Password</div>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Enter Your Password"
                    onChange={handleChange}
                    value={fields.password}
                  />
                  <ErrorMessage>{errorMessage.password}</ErrorMessage>
                </InputDiv>
                <ForgotPasswordLink to="/forgotpassword">
                  Forgot Password?
                </ForgotPasswordLink>
                <LoginButtonContainer>
                  <LoginButton onClick={handleLogin}>Login</LoginButton>
                </LoginButtonContainer>
              </LoginForm>
            </Container1>
          </GridContainer>
        </SubContainer>
      </MainContainer>
    </ThemeProvider>
  );
};

export default Login;
