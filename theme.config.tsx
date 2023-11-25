import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";
import { Socials } from "./components/socials";

const config: DocsThemeConfig = {
  project: {},
  chat: {},
  footer: { component: undefined },
  sidebar: {
    toggleButton: true,
  },
  primaryHue: { dark: 4, light: 4 },
  nextThemes: { forcedTheme: "dark" },
  darkMode: true,
  editLink: { component: undefined },
  feedback: { content: undefined },
  head: (
    <>
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-8HHN0WEXTW"
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-8HHN0WEXTW');
`,
        }}
      ></script>
      <link
        href="https://fonts.googleapis.com/css?family=Fira+Sans+Extra+Condensed"
        rel="stylesheet"
      />
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    </>
  ),
  logo: () => {
    return (
      <h1
        style={{
          marginLeft: "20px",
          fontFamily: "Fira Sans Extra Condensed,sans-serif",
          fontSize: "24px",
          fontWeight: "bold",
          lineHeight: "28px",
        }}
      >
        Aaron Abrams
      </h1>
    );
  },
  themeSwitch: { component: null },
  search: { component: undefined },
  // search: { placeholder: "Search..." },
  navigation: { prev: false, next: false },
  navbar: {
    component: () => {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid rgb(229, 231, 235, 0.15)",
          }}
        >
          <h1
            style={{
              margin: "16px",
              marginLeft: "24px",
              fontFamily: "Fira Sans Extra Condensed,sans-serif",
              fontSize: "24px",
              fontWeight: "bold",
              lineHeight: "28px",
            }}
          >
            Aaron Abrams
          </h1>
          <Socials />
        </div>
      );
    },
  },
  // banner: { text: "MEOW" }, // support ukraine?
  docsRepositoryBase: "https://github.com/aaronabramov/abrams.cc",
  useNextSeoProps: () => {
    return {
      titleTemplate: "%s - Aaron Abrams",
      description: "Aaron Abramov. Software Engineer. Personal Website.",
    };
  },
};

export default config;
