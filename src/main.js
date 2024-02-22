const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");
const os = require("os");
const fs = require("fs");
const path = require("path");
const resizeImg = require("resize-img");
const getMenuTemplate = require("./menuTemplate");

const isInDevMode = process.env.NODE_ENV === "development";
const isMac = process.platform === "darwin";

let mainWindow;

if (require("electron-squirrel-startup")) {
  app.quit();
}

//Creating the main window
const createMainWindow = () => {
  console.log(`isInDevMode: ${isInDevMode}, NODE_ENV: ${process.env.NODE_ENV}`);
  mainWindow = new BrowserWindow({
    title: "Image Resizer",
    width: isInDevMode ? 1000 : 800,
    height: 700,
    icon: path.join(__dirname, "../assets/icons/favicon.ico"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"));
  if (isInDevMode) {
    mainWindow.webContents.openDevTools();
  }
};

//Creating the about window
const createAboutWindow = () => {
  const aboutWindow = new BrowserWindow({
    title: "",
    width: 500,
    height: 400,
  });

  aboutWindow.loadFile(path.join(__dirname, "./renderer/about.html"));
};

//App is ready
app.whenReady().then(() => {
  createMainWindow();

  //Implement menu
  const menuTemplate = getMenuTemplate(createAboutWindow);
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

//Response to the ipcRenderer resize
ipcMain.on("image:resize", (e, options) => {
  options.dest = path.join(os.homedir(), "imageresizer");
  // console.log(options);
  resizeImage(options);
});

//Rezise the image
const resizeImage = async ({ imagePath, width, height, dest }) => {
  try {
    //Reference to https://github.com/kevva/resize-img
    const newPath = await resizeImg(fs.readFileSync(imagePath), {
      width: Number(width),
      height: Number(height),
    });

    //Creating file name
    const fileName = path.basename(imagePath);

    //Creating destination folder if it doesn't exist
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }

    //Write the file to the destination folder
    fs.writeFileSync(path.join(dest, fileName), newPath);

    //Send success to the render but i am checking first if the window is closed and defined
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("image:done");
    }

    //Open the destination folder
    shell.openPath(dest);
  } catch (error) {
    console.log(error);
  }
};

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});
