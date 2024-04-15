import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { Router } from "./common/config/router/router.config";
import { ThemeProvider } from "styled-components";
import { Theme } from "./theme/Theme";
import "./index.css";
import { IntlProvider } from "react-intl";
import english from ".//translation/english.json";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RecoilRoot>
      <IntlProvider locale="en" messages={english as any}>
        <ThemeProvider theme={Theme.dark}>
          <RouterProvider router={Router} />
        </ThemeProvider>
      </IntlProvider>
    </RecoilRoot>
  </React.StrictMode>
);
