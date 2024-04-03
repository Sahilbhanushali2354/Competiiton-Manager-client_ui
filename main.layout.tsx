import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, notification, theme } from "antd";
import { useLocation, Link, Outlet, useNavigate } from "react-router-dom";
import loginimage from "../assets/images/download.jpeg";
import { Dropdown, Space } from "antd";
import { AtomUser } from "../store/atom.store";
import { useRecoilState } from "recoil";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { FStore, auth } from "../configs/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { UserDTO } from "../input.types";
import { useEffect } from "react";
// import logo from '../assets/images/protocol_zone_logo.jpeg'

const { Header, Content, Sider } = Layout;
// const navigate = useNavigate();

const items1: MenuProps["items"] = [
  {
    key: "/users",
    label: <Link to={"/users"}> Users</Link>,
  },
  {
    key: "/profile",
    label: <Link to={"/profile"}>Profile</Link>,
  },
  {
    key: "/competition",
    label: <Link to={"/competition"}>Competition</Link>,
  },
];

const HomeLayout = () => {
  const navigate = useNavigate();

  const [user, setUser] = useRecoilState(AtomUser);

  const items: MenuProps["items"] = [
    {
      key: "",
      label: (
        <>
          <label style={{ color: "blue" }}>{user.uname}</label>
          <br />
          <label style={{ color: "blue", fontSize: "10px" }}>
            {user.email}
          </label>
        </>
      ),
    },

    {
      key: "/login",
      label: (
        <Link
          onClick={() => {
            signout();
          }}
          to={"/Login"}
        >
          Log out
        </Link>
      ),
    },
  ];

  const signout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        notification.open({ message: error, type: error });
      });
  };

  useEffect(() => {
    const x = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      } else {
        getData(user);
      }
    });

    return () => x();
  }, [navigate]);

  const getData = (user: User) => {
    getDoc(doc(FStore, "USERS", user.uid)).then((res) => {
      // console.log(res.data());

      const userData = res.data() as UserDTO;
      setUser(userData);
      console.log("-------userdata id", userData.id); // User is signed out
      // ...
    });
  };
  const path = useLocation().pathname;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleClick = () => {
    navigate("/");
  };
  return (
    <Layout>
      <Header style={{ display: "flex" }}>
        {/* <img src={logo} style={{width:'40px',left:'100%',height:'40px',borderStyle:'none'}} /> */}
        <Menu
          style={{
            height: "100%",
            width: "100%",
            float: "inline-start",
            backgroundColor: "rgb(2,21,41)",
          }}
        >
          <label onClick={handleClick} style={{ color: "white" }}>
            Protocol Zone
          </label>
        </Menu>
        <Menu
          // theme="dark"
          // mode="horizontal"
          // defaultSelectedKeys={["2"]}
          //   items={items1}
          selectedKeys={[path]}
          style={{ flex: 1, minWidth: 0 }}
        >
          <Dropdown menu={{ items }} trigger={["click"]}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <img
                  src={loginimage}
                  style={{
                    overflow: "auto",
                    width: "40px",
                    marginTop: "15px",
                    marginLeft: "5px",
                    borderRadius: "20px",
                  }}
                ></img>
              </Space>
            </a>
          </Dropdown>
        </Menu>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            // defaultSelectedKeys={["1"]}
            // defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
            items={items1}
            selectedKeys={[path]}
          />
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item onClick={handleClick}>
              <label style={{ cursor: "pointer" }}>Home</label>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <label style={{ cursor: "pointer" }}>{path.split("/")[1]}</label>
            </Breadcrumb.Item>
          </Breadcrumb>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default HomeLayout;
