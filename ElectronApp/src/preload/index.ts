import { version } from "../../package.json";

window.addEventListener("DOMContentLoaded", async () => {
  const style = document.createElement("style");
  style.textContent = `
body > div#app::after {
  content: '';
  z-index: 99;
  position: fixed;
  inset: 0;
  backdrop-filter: blur(4px);
  background-color: rgba(0, 0, 0, .3);
}
body > div#app::before {
  content: '天翼云电脑续命工具\\A 加载中...';
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 999;
  transform: translate(-50%, -50%);
  font-size: 1em;
  text-align: center;
  line-height: 1.5;
  display: block;
  padding: 1em 1.5em;
  background: #fff;
  border-radius: 0.6em;
  white-space: pre-wrap;
}
main#CTYunPCKeepAlive + div#app::after {
  content: none;
}
main#CTYunPCKeepAlive + div#app::before {
  content: none;
}
  `;
  (document.head || document.documentElement).appendChild(style);

  try {
    const jsCode = await fetch("http://127.0.0.1:5173/__vite-plugin-monkey.install.user.js")
      .then((res) => res.text())
      .then((text) => {
        if (text.trim().startsWith("// ==UserScript==")) {
          return text;
        } else {
          throw new Error("Proxy not working");
        }
      })
      .catch(() => {
        return Promise.any(
          [
            "https://proxyd.picpi.top",
            "https://github.404.vin",
            "https://gh.llkk.cc",
            "https://edgeone.gh-proxy.org",
            "https://cdn.gh-proxy.org",
            "https://hk.gh-proxy.org",
            "https://gh-proxy.org",
          ].map((proxy) =>
            fetch(
              proxy +
                "/https://github.com/4x25/CTYunPCKeepAlive/raw/refs/heads/dist/user-script.user.js?_=" +
                Date.now(),
            )
              .then((res) => res.text())
              .then((text) => {
                if (text.trim().startsWith("// ==UserScript==")) {
                  return text;
                } else {
                  throw new Error("Proxy not working");
                }
              }),
          ),
        );
      });

    const script = document.createElement("script");
    script.textContent = `;window.CTYunPCKeepAliveAppVersion = '${version}';`;
    script.textContent += jsCode;
    (document.head || document.documentElement).appendChild(script);
  } catch (error) {
    style.textContent += `
body > div#app::before {
  content: '天翼云电脑续命工具\\A 加载失败！\\A \\A ${(error as Error).message}';
}
    `;
  }
});
