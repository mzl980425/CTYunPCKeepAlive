import { unsafeWindow } from "$";
import { version } from "../../package.json";

export const appVersion = (unsafeWindow || window).CTYunPCKeepAliveElectronVersion || "0.0.0";

export const scriptVersion = version;
