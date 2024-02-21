const { app, BrowserWindow } = require("electron");
const path = require("path");

const isMac = process.platform === "darwin";

if (require("electron-squirrel-startup")) {
  app.quit();
}

const createMainWindow = () => {
  const mainWindow = new BrowserWindow({
    title: "Image Resizer",
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"));
  mainWindow.webContents.openDevTools();
};

// app.on("ready", createWindow);
app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});
