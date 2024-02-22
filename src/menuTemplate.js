// menuTemplate.js
const { app } = require('electron');

const isMac = process.platform === 'darwin';

const getMenuTemplate = (createAboutWindow) => [
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
              click: createAboutWindow,
            },
          ],
        },
      ]),
];

module.exports = getMenuTemplate;
