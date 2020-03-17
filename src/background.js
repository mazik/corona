"use strict";

import path from "path";
import axios from "axios";
import { app, protocol, BrowserWindow, Tray, ipcMain, dialog } from "electron";
import {
  createProtocol,
  installVueDevtools
} from "vue-cli-plugin-electron-builder/lib";
const isDevelopment = process.env.NODE_ENV !== "production";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let tray;

// Don't show the app in the doc
app.dock.hide();

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);

makeSingleInstance();

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 320,
    height: 560,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/configuration.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  win.on("closed", () => {
    win = null;
  });

  win.on("blur", () => {
    if (!win.webContents.isDevToolsOpened()) win.hide();
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    try {
      await installVueDevtools();
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createTray();
  createWindow();
});

ipcMain.on("close-app", () => {
  app.quit();
});

ipcMain.on("online-status", (event, isOnline) => {
  let data = {};

  if (isOnline) {
    getCountry()
      .then(country => {
        data.country = country;
      })
      .then(() =>
        getCoronaOverview(data.country)
          .then(overview => {
            data.deaths = overview.deaths.value;
            data.confirmed = overview.confirmed.value;
            data.recovered = overview.recovered.value;
          })
          .then(() => {
            data.total = data.deaths + data.confirmed + data.recovered;
          })
      )
      .then(() => {
        event.reply("corona-data", data);
      });
  }
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance() {
  if (process.mas) return;

  app.requestSingleInstanceLock();

  app.on("second-instance", () => {
    if (win) {
      if (win.isMinimized()) win.restore();

      win.focus();
    }
  });
}

function createTray() {
  // eslint-disable-next-line no-undef
  tray = new Tray(path.join(__static, "img/corona.png"));
  tray.setToolTip("Corona - COVID-19");
  tray.on("click", () => toggleWindow());
}

function toggleWindow() {
  win.isVisible() ? win.hide() : showWindow();
}

function showWindow() {
  const position = getWindowPosition();
  win.setPosition(position.x, position.y, false);
  win.show();
}

function getWindowPosition() {
  const windowBounds = win.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  );

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  return { x, y };
}

function getCountry() {
  return axios
    .get("http://ip-api.com/json")
    .then(response => response.data.country)
    .catch(error =>
      dialog.showErrorBox(
        `An error occurred during Country detection. ${error.toString()}`
      )
    );
}

function getCoronaOverview(country) {
  return axios
    .get(`https://covid19.mathdro.id/api/countries/${country.toLowerCase()}`)
    .then(overview => overview.data)
    .catch(error =>
      dialog.showErrorBox(
        `An error occurred during Corona detection. ${error.toString()}`
      )
    );
}
