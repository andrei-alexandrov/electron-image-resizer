const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

const isMac = process.platform === "darwin";

if (require("electron-squirrel-startup")) {
  app.quit();
}

//Creating the main window
const createMainWindow = () => {
  const mainWindow = new BrowserWindow({
    title: "Image Resizer",
    width: 1000,
    height: 600,
    icon: path.join(__dirname, "../assets/icons/favicon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"));
  mainWindow.webContents.openDevTools();
};

//Creating the about window
const createAboutWindow = () => {
  const aboutWindow = new BrowserWindow({
    title: "",
    width: 400,
    height: 300,
  });

  aboutWindow.loadFile(path.join(__dirname, "./renderer/about.html"));
};

//App is ready
app.whenReady().then(() => {
  createMainWindow();

  //Implement menu
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

const menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Quit",
        click: () => {
          app.quit();
        },
        accelerator: "Ctrl + q",
      },
    ],
  },
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              label: "About",
              click: createAboutWindow,
            },
          ],
        },
      ]
    : [
        {
          label: "Help",
          submenu: [
            {
              label: "About",
              click: () => {
                createAboutWindow();
              },
            },
          ],
        },
      ]),
];

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});
