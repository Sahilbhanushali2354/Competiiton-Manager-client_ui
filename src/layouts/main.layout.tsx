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
import { signOut } from "firebase/auth";
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
  const [selectedMenuKey, setSelectedMenuKey] = useState("1");
  const path = useLocation().pathname;

  useEffect(() => {
    const _currentUser = window.localStorage.getItem("auth");
    setAuthDetails(_currentUser ?? "");
  }, []);

  useEffect(() => {
    console.log("called");

    const _Sidermenu = window.localStorage.getItem("SiderMenu");
    setSelectedMenuKey(_Sidermenu ?? "1");
  }, [selectedMenuKey]);
  useEffect(() => {
    const x = window.localStorage.getItem("theme");
    const _currentTheme = x && JSON.parse(x);
    setThemeData(_currentTheme ?? Theme.dark);
  }, []);

  const translations = langaugeName === "hiIN" ? hindi : english;

  const HeaderItem = [
    {
      key: "1",
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
              {translations.english}
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
              {translations.hindi}
            </span>
          ),
        },
  ];

  const SiderItems = [
    {
      key: "1",
      label: <Link to="/dashboard">{translations.dashboard}</Link>,
    },
    {
      key: "2",
      label: <Link to="/profile">{translations.profile}</Link>,
    },
    {
      key: "3",
      label: <Link to="/allpresentation">{translations.presentations}</Link>,
    },
    {
      key: "4",
      label: <Link to="/activefeedbackforms">{translations.feedback}</Link>,
    },
  ];

  const items = [
    ...SiderItems,
    {
      key: "100",
      label: (
        <Button
          type="link"
          onClick={() =>
            signOut(auth)
              .then(() => {
                setLoader(true);
                localStorage.removeItem("SiderMenu");
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

  const handleMenuChange = (keys: any) => {
    setSelectedMenuKey(keys.key);
    window.localStorage.setItem("SiderMenu", keys.key);
  };

  return (
    <ConfigProvider
      locale={langaugeName === "hiIN" ? hiIN : enUS}
      theme={{
        components: {
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
                defaultSelectedKeys={["1"]}
                items={HeaderItem}
                style={{ flex: 1, minWidth: 0 }}
              />
              <Dropdown menu={{ items }} trigger={["click"]}>
                <Space>
                  <StyledDiv>{authDetails}</StyledDiv>
                  <Avatar icon={<UserOutlined />}></Avatar>
                </Space>
              </Dropdown>
              <Switch
                checked={themeData.id === Theme.dark.id}
                onChange={toggleChange}
                style={{
                  backgroundColor:
                    themeData.id === Theme.dark.id ? "grey" : "black",
                }}
              />
              <Dropdown menu={{ items: LangaugeItems }}>
                <div>
                  <a onClick={(e) => e.preventDefault()}>
                    {langaugeName === "enUS" ? (
                      <Space>{translations.english}</Space>
                    ) : (
                      <Space>{translations.hindi}</Space>
                    )}
                  </a>
                </div>
              </Dropdown>
            </Header>

            <Layout>
              <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                  console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                  console.log(collapsed, type);
                }}
              >
                <div className="demo-logo-vertical" />
                <Menu
                  mode="inline"
                  selectedKeys={selectedMenuKey as any}
                  defaultSelectedKeys={["1"]}
                  items={SiderItems}
                  onClick={handleMenuChange}
                />
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
