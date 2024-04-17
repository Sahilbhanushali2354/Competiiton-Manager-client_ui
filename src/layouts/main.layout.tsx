import { useEffect, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Layout,
  Menu,
  Spin,
  Dropdown,
  Button,
  message,
  Avatar,
  Switch,
  ConfigProvider,
  Space,
  theme,
  MenuProps,
} from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../common/config/firebase/firebase.config";
import { AtomLangauge, AtomTheme } from "../store/atom/atom.store";
import { useRecoilState } from "recoil";
import { Theme } from "../theme/Theme";
import styled, { ThemeProvider } from "styled-components";
import hiIN from "antd/locale/hi_IN";
import enUS from "antd/locale/en_US";
import hindi from "../translation/hindi.json";
import english from "../translation/english.json";

const { Header, Content, Sider, Footer } = Layout;

const MainContainer = styled(Layout)`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.color};
  height:100vh
  }
`;
const ContentContainer = styled(Content)`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.color};
`;
const StyledDiv = styled.div`
  color: ${({ theme }) => theme.color};
`;

const MainLayout = () => {
  const navigate = useNavigate();
  const [langaugeName, setLangaugeName] = useRecoilState(AtomLangauge);
  const [themeData, setThemeData] = useRecoilState(AtomTheme);
  const [loader, setLoader] = useState<boolean>(false);
  const [authDetails, setAuthDetails] = useState("");
  const path = useLocation().pathname;

  useEffect(() => {
    const x = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      }
    });

    return () => x();
  }, [navigate]);

  useEffect(() => {
    const _currentUser = window.localStorage.getItem("auth");
    setAuthDetails(_currentUser ?? "");
  }, []);

  useEffect(() => {
    const x = window.localStorage.getItem("theme");
    const _currentTheme = x && JSON.parse(x);
    setThemeData(_currentTheme ?? Theme.dark);
  }, []);

  const translations = langaugeName === "enUS" ? english : hindi;

  const HeaderItem = [
    {
      key: "/dashboard",
      label: <Link to="/dashboard">{translations.home}</Link>,
    },
  ];

  const LangaugeItems: MenuProps["items"] = [
    langaugeName === "hiIN"
      ? {
          key: "enUS",
          label: (
            <span
              onClick={() => {
                setLangaugeName("enUS");
                window.localStorage.setItem("langauge", "enUS");
              }}
            >
              English
            </span>
          ),
        }
      : {
          key: "hiIN",
          label: (
            <span
              onClick={() => {
                setLangaugeName("hiIN");
                window.localStorage.setItem("langauge", "hiIN");
              }}
            >
              {hindi.hindi}
            </span>
          ),
        },
  ];

  const SiderItems = [
    {
      key: "/dashboard",
      label: <Link to="/dashboard">{translations.dashboard}</Link>,
    },
    {
      key: "/profile",
      label: <Link to="/profile">{translations.profile}</Link>,
    },
    {
      key: "/allpresentation",
      label: <Link to="/allpresentation">{translations.presentations}</Link>,
    },
    {
      key: "/activefeedbackforms",
      label: <Link to="/activefeedbackforms">{translations.feedback}</Link>,
    },
  ];

  const items = [
    ...SiderItems,
    {
      key: "/login",
      label: (
        <Button
          style={{ padding: "0" }}
          type="link"
          onClick={() =>
            signOut(auth)
              .then(() => {
                setLoader(true);
                localStorage.clear();
                navigate("/login");
                message.success(translations.logoutSuccess);
              })
              .catch((error) => {
                setLoader(false);
                message.error(error);
              })
          }
        >
          {translations.logout}
        </Button>
      ),
    },
  ];
  const toggleChange = (checked: boolean) => {
    setThemeData(checked ? Theme.dark : Theme.light);
    window.localStorage.setItem(
      "theme",
      checked ? JSON.stringify(Theme.dark) : JSON.stringify(Theme.light)
    );
  };

  return (
    <ConfigProvider
      locale={langaugeName === "hiIN" ? hiIN : enUS}
      theme={{
        components: {
          Message: {
            colorBgContainer:
              themeData.id === Theme.dark.id ? "black" : "white",
          },
          Layout: {
            colorPrimaryBg: themeData.id === Theme.dark.id ? "black" : "white",
            headerBg: themeData.id === Theme.dark.id ? "black" : "white",
            siderBg: themeData.id === Theme.dark.id ? "black" : "white",
            footerBg: themeData.id === Theme.dark.id ? "black" : "white",
          },
          Menu: {
            itemBg: themeData.id === Theme.dark.id ? "black" : "white",
            itemColor: themeData.id === Theme.dark.id ? "white" : "black",
          },
        },

        algorithm:
          themeData.id === Theme.dark.id
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm,
      }}
    >
      <ThemeProvider theme={themeData}>
        <Spin spinning={loader}>
          <MainContainer>
            <Header
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <div className="demo-logo" />
              <Menu
                mode="horizontal"
                items={HeaderItem}
                style={{ flex: 1, minWidth: 0 }}
                defaultSelectedKeys={[path]}
              />
              <Switch
                checked={themeData.id === Theme.dark.id}
                onChange={toggleChange}
                style={{
                  backgroundColor:
                    themeData.id === Theme.dark.id ? "grey" : "black",
                }}
              />

              <div style={{ padding: "5px" }}></div>
              <Dropdown trigger={["click"]} menu={{ items: LangaugeItems }}>
                <div>
                  <a onClick={(e) => e.preventDefault()}>
                    {langaugeName === "enUS" ? (
                      <Space>English</Space>
                    ) : (
                      <Space>{translations.hindi}</Space>
                    )}
                  </a>
                </div>
              </Dropdown>
              <div style={{ padding: "5px" }}></div>

              <Dropdown menu={{ items }} trigger={["click"]}>
                <Space>
                  <StyledDiv style={{ cursor: "pointer" }}>
                    {authDetails}
                  </StyledDiv>
                  <Avatar icon={<UserOutlined />}></Avatar>
                </Space>
              </Dropdown>
            </Header>

            <Layout>
              <Sider breakpoint="lg" collapsedWidth="0">
                <div className="demo-logo-vertical" />
                <Menu mode="inline" selectedKeys={[path]} items={SiderItems} />
              </Sider>
              <Layout style={{ padding: "0 24px 24px" }}>
                <Breadcrumb
                  style={{ margin: "16px 0" }}
                  items={[
                    { title: <Link to="/dashboard">{translations.home}</Link> },
                    { title: <Link to={path}>{path.replace("/", "")}</Link> },
                  ]}
                />
                <ContentContainer
                  style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                    overflowY: "auto",
                    maxHeight: "calc(100vh - 64px - 48px)",
                    // position:'fixed'
                  }}
                >
                  <div>
                    <Outlet />
                  </div>
                </ContentContainer>
                <Footer style={{ textAlign: "center" }}>
                  <StyledDiv>{translations.version}</StyledDiv>
                </Footer>
              </Layout>
            </Layout>
          </MainContainer>
        </Spin>
      </ThemeProvider>
    </ConfigProvider>
  );
};

export default MainLayout;
