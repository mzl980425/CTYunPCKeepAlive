import { app, shell, BrowserWindow, powerSaveBlocker } from "electron";
import { join } from "path";
import icon from "../../resources/icon.ico?asset";

let powerSaveBlockerId: number | null = null;

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    minWidth: 375,
    width: 375,
    maxWidth: 375,
    minHeight: 250,
    height: 750,
    show: false,
    maximizable: false,
    autoHideMenuBar: true,
    ...(process.platform === "win32" ? { icon } : {}),
    webPreferences: {
      backgroundThrottling: false,
      preload: join(__dirname, "../preload/index.js"),
      webSecurity: false,
      sandbox: false,
    },
  });
  if (process.platform === "win32") {
    mainWindow.setIcon(icon);
  }

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  mainWindow.loadURL("https://pc.ctyun.cn/");
}

app.whenReady().then(() => {
  createWindow();

  powerSaveBlockerId = powerSaveBlocker.start("prevent-app-suspension");

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (powerSaveBlockerId !== null && powerSaveBlocker.isStarted(powerSaveBlockerId)) {
    powerSaveBlocker.stop(powerSaveBlockerId);
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});
