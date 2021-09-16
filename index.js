const { app, Tray, Menu } = require("electron");
const WindowsBalloon = require("node-notifier").WindowsBalloon;
const notifier = require("node-notifier");
const path = require("path");
const iconPath = path.join(__dirname, "icon.png");
let trayApp = null;
let opsys = process.platform;
let status = "enabled";
let setInterval;
let notificationMilisecondInterval = 0;
const appname = "BreakTime Buddy";

const notifications = [
  "It’s okay to take a break. So why not do exactly that right now.",
  "Disconnect to reconnect. You need to take a break ASAP.",
  "Production environment is crashing and everything is going up in flames. So this is the perfect time for you to take a break.",
  "Relax. Nothing is under control. Step away from the keyboard. Rest your mind. Calm your heart.",
  "If you’re tired, learn to rest not quit. And what better time to do just that than now.",
  "For the love of your work, please take a break ASAP! Its break time!",
  "Raise your hand if you need a break from your work! Even if you did not raise your hand it is time for a small break.",
  "Sometimes giving yourself a break is the very thing you need. And i think you need that right now.",
]

const winNotifier = new WindowsBalloon({
  withFallback: false,
  customPath: void 0,
});

const toMiliseconds = (minutes) => {
  return 60000 * minutes;
};

const intervalSelected = (minutes) => {
  if (notificationMilisecondInterval === toMiliseconds(minutes) || status === "disabled") {
    notificationMilisecondInterval = 0;
    clearInterval(setInterval);
  } else {
    notificationMilisecondInterval = toMiliseconds(minutes);
    startNewInterval();
  }
};

const sendNotification = () => {
  if (opsys == "win32" || opsys == "win64") {
    winNotifier.notify(
      {
        title: appname,
        message: notifications[~~(Math.random() * notifications.length)],
        sound: true,
        wait: false, // Wait for User Action against Notification
        type: "info", // The notification type : info | warn | error
      },
      function (err, response) {
        console.log(err);
        console.log(response);
      }
    );
  } else {
    notifier.notify(
      {
        title: appname,
        message: notifications[~~(Math.random() * notifications.length)],
        sound: true,
        wait: false, // Wait for User Action against Notification
        type: "info", // The notification type : info | warn | error
      },
      function (err, response) {
        console.log(err);
        console.log(response);
      }
    );
  }
};

const startNewInterval = () => {
  clearInterval(setInterval);
  setInterval = setInterval(function () {
    sendNotification();
  }, notificationMilisecondInterval);
};

const getContextMenu = () => {
  let contextMenu = Menu.buildFromTemplate([
    {
      label: "Enable",
      type: "checkbox",
      checked: status == "enabled",
      click: function () {
        if (status === "disabled") {
          status = "enabled";
        } else {
          status = "disabled";
          clearInterval(setInterval);
          notificationMilisecondInterval = 0;
        }
        trayApp.setContextMenu(getContextMenu());
      },
    },
    {
      label: "Try it out!",
      click: function () {
        sendNotification();
      },
    },
    {
      label: "10 minutes",
      type: "checkbox",
      checked: notificationMilisecondInterval == toMiliseconds(10),
      click: function () {
        intervalSelected(10);
        trayApp.setContextMenu(getContextMenu());
      },
    },
    {
      label: "30 minutes",
      type: "checkbox",
      checked: notificationMilisecondInterval == toMiliseconds(30),
      click: function () {
        intervalSelected(30);
        trayApp.setContextMenu(getContextMenu());
      },
    },
    {
      label: "1 hour",
      type: "checkbox",
      checked: notificationMilisecondInterval == toMiliseconds(60),
      click: function () {
        intervalSelected(60);
        trayApp.setContextMenu(getContextMenu());
      },
    },
    {
      label: "1.5 hour",
      type: "checkbox",
      checked: notificationMilisecondInterval == toMiliseconds(90),
      click: function () {
        intervalSelected(90);
        trayApp.setContextMenu(getContextMenu());
      },
    },
    {
      label: "2 hours",
      type: "checkbox",
      checked: notificationMilisecondInterval == toMiliseconds(120),
      click: function () {
        intervalSelected(120);
        trayApp.setContextMenu(getContextMenu());
      },
    },
    {
      label: "Exit",
      click: function () {
        app.exit();
      },
    },
  ]);
  return contextMenu;
};

app.on("ready", () => {
  trayApp = new Tray(iconPath);
  var contextMenu = getContextMenu();
  trayApp.setToolTip(appname);
  trayApp.setContextMenu(contextMenu);
});
