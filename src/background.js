"use strict";

/* global __static */

import path from "path";
import axios from "axios";
import settings from "electron-settings";
import { autoUpdater } from "electron-updater";
import { app, protocol, BrowserWindow, Tray, ipcMain, dialog } from "electron";
import {
  createProtocol,
  installVueDevtools
} from "vue-cli-plugin-electron-builder/lib";

const appFolder = path.dirname(process.execPath);
const updateExe = path.resolve(appFolder, "..", "Update.exe");
const exeName = path.basename(process.execPath);

const isDevelopment = process.env.NODE_ENV !== "production";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let tray;
let settingsWindow;
let isSettingsWindowShow;
let closed;

// Don't show the app in the doc
if (process.platform === "darwin") app.dock.hide();

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);

makeSingleInstance();

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 320,
    height: 545,
    show: false,
    frame: false,
    resizable: false,
    skipTaskbar: true,
    fullscreenable: false,
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
    autoUpdater.checkForUpdatesAndNotify();
  }

  win.on("closed", () => {
    win = null;
  });

  win.on("blur", () => {
    if (!win.webContents.isDevToolsOpened() && !isSettingsWindowShow)
      win.hide();
  });
}

function createSettingsWindow() {
  settingsWindow = new BrowserWindow({
    width: 320,
    height: 250,
    show: false,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    settingsWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL + "subpage");
    if (!process.env.IS_TEST) settingsWindow.webContents.openDevTools();
  } else {
    createProtocol("app");
    settingsWindow.loadURL("app://./subpage.html");
  }

  settingsWindow.on("close", event => {
    if (!closed) event.preventDefault();
    isSettingsWindowShow = false;
    settingsWindow.hide();
  });

  settingsWindow.on("closed", () => {
    if (closed) {
      settingsWindow = null;
    }
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
  createSettingsWindow();

  if (!isDevelopment) launchAtStartup();
});

ipcMain.on("close-app", () => {
  closed = true;
  app.quit();
});

ipcMain.on("settings", () => {
  isSettingsWindowShow = true;
  settingsWindow.show();
});

ipcMain.on("online-status", (event, isOnline) => {
  dataManipulate(event, "corona-data", isOnline);
});

ipcMain.on("refresh", (event, isOnline) => {
  dataManipulate(event, "refresh-back", isOnline);
});

ipcMain.on("get-all-countries", async (event, isOnline) => {
  let allCountries;

  if (isOnline) {
    if (settings.has("countries")) {
      allCountries = settings.get("countries");
    } else {
      allCountries = await getAllCountries();
      settings.set("countries", allCountries);
    }
  } else {
    if (settings.has("countries")) {
      allCountries = settings.get("countries");
    } else {
      allCountries = { countries: { Mars: "None" } };
    }
  }

  event.reply("send-all-countries", { countries: allCountries });
});

ipcMain.on("manual-country-selection", (event, countryCode, locateStyle) => {
  settings.set("corona.countryCode", countryCode);
  settings.set("corona.countryLocate", locateStyle);
});

ipcMain.on("open-at-login", (event, isOpenAtLogin) => {
  settings.set("settings.isOpenAtLogin", isOpenAtLogin);
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

function launchAtStartup() {
  let isOpenAtLogin;

  if (!settings.has("settings.isOpenAtLogin")) {
    isOpenAtLogin = true;
  } else {
    isOpenAtLogin = settings.get("settings.isOpenAtLogin");
  }

  if (process.platform === "darwin") {
    app.setLoginItemSettings({
      openAtLogin: isOpenAtLogin,
      openAsHidden: true
    });
  } else {
    app.setLoginItemSettings({
      openAtLogin: isOpenAtLogin,
      openAsHidden: true,
      path: updateExe,
      args: [
        "--processStart",
        `"${exeName}"`,
        "--process-start-args",
        `"--hidden"`
      ]
    });
  }
}

function createTray() {
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
    .then(response => response.data)
    .catch(error =>
      dialog.showErrorBox(
        `An error occurred during Country detection. ${error.toString()}`
      )
    );
}

function getAllCountries() {
  return axios
    .get("https://covid19.mathdro.id/api/countries")
    .then(response => response.data.countries)
    .catch(error =>
      dialog.showErrorBox(
        `An error occurred during Countries listing. ${error.toString()}`
      )
    );
}

function getCoronaOverview(countryCode) {
  return axios
    .get(
      `https://covid19.mathdro.id/api/countries/${countryCode.toLowerCase()}`
    )
    .then(overview => overview.data)
    .catch(error =>
      dialog.showErrorBox(
        `An error occurred during Corona detection. ${error.toString()}`
      )
    );
}

function dailyGlobalUpdates() {
  return axios
    .get("https://covid19.mathdro.id/api/daily")
    .then(response => response)
    .catch(error =>
      dialog.showErrorBox(
        `An error occurred during latest update dection. ${error.toString()}`
      )
    );
}

function dataManipulate(event, channel, online) {
  let data = {};

  if (settings.get("corona.countryLocate") == "manual") {
    const countryCode = settings.get("corona.countryCode");

    if (online) {
      getCoronaOverview(countryCode)
        .then(overview => {
          data.deaths = overview.deaths.value;
          data.confirmed = overview.confirmed.value;
          data.recovered = overview.recovered.value;
        })
        .then(() => {
          data.total = data.deaths + data.confirmed + data.recovered;
        })
        .then(() => {
          data.country = countryCode;
          data.countryCode = countryCode;
        })
        .then(async () => {
          data.daily = (await dailyGlobalUpdates()).data.pop();
        })
        .then(() => {
          settings.set("corona", data);
          settings.set("corona.countryCode", countryCode);
          settings.set("corona.countryLocate", "manual");
        })
        .then(() => event.reply(channel, { corona: data }))
        .catch(error => dialog.showErrorBox(error));
    } else {
      if (settings.get("corona.countryCode") == countryCode) {
        data = settings.get("corona");

        event.reply(channel, { corona: data });
      } else {
        data.country = "Mars";
        data.deaths = 0;
        data.confirmed = 0;
        data.recovered = 0;
        data.total = 0;
        data.daily = {
          totalConfirmed: 0,
          totalRecovered: 0,
          reportDateString: new Date().toLocaleDateString(),
          mainlandChina: 0,
          otherLocations: 0
        };

        event.reply(channel, { corona: data });
      }
    }
  } else {
    if (online) {
      getCountry()
        .then(country => {
          data.country = country.country;
          data.countryCode = country.countryCode;
        })
        .then(() =>
          getCoronaOverview(data.countryCode)
            .then(overview => {
              data.deaths = overview.deaths.value;
              data.confirmed = overview.confirmed.value;
              data.recovered = overview.recovered.value;
            })
            .then(() => {
              data.total = data.deaths + data.confirmed + data.recovered;
            })
            .then(async () => {
              data.daily = (await dailyGlobalUpdates()).data.pop();
            })
            .catch(error => dialog.showErrorBox(error))
        )
        .then(() => {
          settings.set("corona", data);
        })
        .then(() => {
          event.reply(channel, { corona: data });
        });
    } else {
      if (settings.has("corona.country")) {
        data = settings.get("corona");

        event.reply(channel, { corona: data });
      } else {
        data.country = "Mars";
        data.deaths = 0;
        data.confirmed = 0;
        data.recovered = 0;
        data.total = 0;
        data.daily = {
          totalConfirmed: 0,
          totalRecovered: 0,
          reportDateString: new Date().toLocaleDateString(),
          mainlandChina: 0,
          otherLocations: 0
        };

        event.reply(channel, { corona: data });
      }
    }
  }
}
