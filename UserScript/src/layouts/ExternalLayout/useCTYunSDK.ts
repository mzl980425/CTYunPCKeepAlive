import { unsafeWindow } from "$";
import { useExternal, useRequest } from "ahooks";
import { fetch } from "../../utils/nativeFunctions";

export default function useCTYunSDK() {
  const { data, error } = useRequest(async () => {
    const scriptUrl = document.querySelector('script[src*="main."]')?.getAttribute("src");
    if (!scriptUrl) throw new Error("Script URL not found");
    const response = await fetch(scriptUrl);
    if (!response.ok) throw new Error("Failed to fetch script");
    let jsCode = await response.text();
    jsCode = jsCode
      .replace('.mount("#app")', ".version")
      .replace(/\w+\.kL\.get\(\w+\.Q\)/, (str) => `(window.__APP__ = ${str})`);
    const blob = new Blob([jsCode], { type: "application/javascript" });
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
  });

  const status = useExternal(data, {
    type: "js",
  });

  if (status === "ready") {
    return (unsafeWindow || window).__APP__ ? status : "error";
  }

  return error ? "error" : status;
}
