import { createBrowserRouter } from "react-router-dom";
import Login from "../../../pages/login.page";
import Dashboard from "../../../pages/dashboard.page";
import Splash from "../../../pages/splash.page";
import Forgotpassword from "../../../pages/forgotPassword.page";
import MainLayout from "../../../layouts/main.layout";
import Profile from "../../../pages/profile.page";
import Presentation from "../../../pages/Presentation.page";
import AllPresentation from "../../../pages/AllPresentation.page";
import Feedback from "../../../pages/Feedback.page";
import ActiveFeedbacks from "../../../pages/ActiveFeedbacks.page";

export const Router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      { path: "/allpresentation", element: <AllPresentation /> },
      {
        path: "/allpresentation/edit/:id",
        element: <Presentation />,
      },
      {
        path: "/allpresentation/add",
        element: <Presentation />,
      },
      {
        path: "/activefeedbackforms",
        element: <ActiveFeedbacks />,
      },
      {
        path: "/activefeedbackforms/new/:id",
        element: <Feedback />,
      },
    ],
  },
  {
    path: "/",
    element: <Splash />,
  },

  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgotpassword",
    element: <Forgotpassword />,
  },
]);
