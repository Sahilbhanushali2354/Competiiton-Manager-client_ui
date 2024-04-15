import { Button, Input, Switch, message } from "antd";
import { ChangeEvent, useEffect, useState } from "react";
import { NewAccountErrorDTO } from "../types/input.type";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/protocol zone logo.png";
import { AtomTheme, NewAccountAtom } from "../store/atom/atom.store";
import { useRecoilState } from "recoil";
import { ThemeProvider } from "styled-components";
import { Theme } from "../theme/Theme";
import { RollbackOutlined } from "@ant-design/icons";
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

const CreateAccount = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useRecoilState(NewAccountAtom);
  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState<NewAccountErrorDTO>(
    {} as NewAccountErrorDTO
  );
  const [userProfile, setUserProfile] = useState<File>();
  const [themeData, setThemeData] = useRecoilState(AtomTheme);

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
    );
  };

  const handlechange = (e: ChangeEvent<HTMLInputElement>) => {
    let name = e.target.name;
    let value = e.target.value;
    setFields((prevfields) => ({ ...prevfields, [name]: value }));

    let _error = { ...errorMessage };

    if (
      name === "uname" ||
      name === "email" ||
      name === "contact" ||
      name === "address"
    )
      _error = {
        ...errorMessage,
        uname: name === "uname" && !value ? "Enter Username" : "",
        email: name === "email" && !value ? "Enter Email" : "",
        contact: name === "contact" && !value ? "Enter Phone Number" : "",
        address: name === "address" && !value ? "Enter Address" : "",
      };
    setErrorMessage(_error);
  };
  const handleProfile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    let { name, value } = e.target;
    console.log(value);

    if (files && files.length > 0) {
      const selectedFile = files[0];
      setUserProfile(selectedFile);
      let _error = { ...errorMessage };

      if (name === "profile")
        _error = {
          ...errorMessage,
          profile: name === "profile" && !value ? "Select Profile Photo" : "",
        };
      setErrorMessage(_error);

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result?.toString();
        if (base64String) {
          setFields((prevfields) => ({
            ...prevfields,
            profile: base64String,
          }));
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleCreate = async () => {
    let _error = { ...errorMessage };

    if (!fields.uname) _error = { ..._error, uname: "Enter Username" };

    if (!fields.email) {
      _error = { ..._error, email: "Enter Email" };
    } else if (!/^\S+@(gmail\.com|gmail\.in)$/.test(fields.email)) {
      _error = { ..._error, email: "Enter Valid Email" };
    }

    if (!fields.contact) _error = { ..._error, contact: "Enter Phone Number" };

    if (!userProfile) {
      _error = { ..._error, profile: "Select Profile Photo" };
    } else {
      const extensions = [
        "image/apng",
        "image/avif",
        "image/gif",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/svg+xml",
        "image/webp",
      ];
      if (!extensions.includes(userProfile.type)) {
        _error = { ..._error, profile: "Enter Valid Profile Photo" };
      }
      if (userProfile.size < 1048.487) {
        _error = { ..._error, profile: "Enter Valid Profile Photo" };
      }
    }

    if (!fields.address) {
      _error = { ..._error, address: "Enter Address" };
    }
    const noErrors = Object.values(_error).every((value) => value === "");

    if (noErrors) {
      setLoader(true);
      navigate("/createpassword");
      message.success("People Data Added Successfully");
    } else {
      setErrorMessage(_error);
    }
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
                  <Title>Create Your Account</Title>
                </Header>

                <div style={{ padding: "7px" }}></div>
                <InputDiv>
                  <div>Userame</div>
                  <Input
                    type="text"
                    name="uname"
                    placeholder="Enter Your Name"
                    onChange={handlechange}
                    value={fields.uname}
                  />
                  <ErrorMessage>{errorMessage.uname}</ErrorMessage>
                </InputDiv>
                <InputDiv>
                  <div>Email</div>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter Your Email"
                    onChange={handlechange}
                    value={fields.email}
                  />
                  <ErrorMessage>{errorMessage.email}</ErrorMessage>
                </InputDiv>
                <InputDiv>
                  <div>Profile Photo</div>
                  <Input type="file" name="profile" onChange={handleProfile} />
                  <ErrorMessage>{errorMessage.profile}</ErrorMessage>
                </InputDiv>
                <InputDiv>
                  <div>Phone Number</div>
                  <Input
                    type="number"
                    name="contact"
                    placeholder="Enter Your Phone Number"
                    onChange={handlechange}
                    value={fields.contact}
                  />
                  <ErrorMessage>{errorMessage.contact}</ErrorMessage>
                </InputDiv>
                <InputDiv>
                  <div>Address</div>
                  <Input
                    type="text"
                    name="address"
                    placeholder="Enter Your Address"
                    onChange={handlechange}
                    value={fields.address}
                  />
                  <ErrorMessage>{errorMessage.address}</ErrorMessage>
                </InputDiv>
                {/* <InputDiv>
                  <div>Password</div>
                  <Input.Password
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    type="password"
                    name="password"
                    placeholder="Enter Your Password"
                    onChange={handlechange}
                    value={fields.password}
                  ></Input.Password>
                  <ErrorMessage>{errorMessage.password}</ErrorMessage>
                </InputDiv> */}
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <LoginButton onClick={handleCreate}>
                    Create Account
                  </LoginButton>
                  <Button
                    style={{ width: "50px", borderRadius: "20px" }}
                    icon={<RollbackOutlined />}
                    onClick={() => navigate("/login")}
                  ></Button>
                </div>
              </LoginForm>
            </Container1>
          </GridContainer>
        </SubContainer>
      </MainContainer>
    </ThemeProvider>
  );
};

export default CreateAccount;
