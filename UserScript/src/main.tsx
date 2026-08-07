import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { hookWindow } from "./utils";
import { unsafeWindow } from "$";
import "./main.less";

// 移除冗余属性
hookWindow(unsafeWindow || window);

ReactDOM.createRoot(
  (() => {
    const main = document.createElement("main");
    main.setAttribute("id", "CTYunPCKeepAlive");
    document.body.insertBefore(main, document.body.firstChild);
    return main;
  })()
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
