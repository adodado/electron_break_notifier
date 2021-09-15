const { app, Tray, Menu } = require("electron");
const path = require("path");
const iconPath = path.join(__dirname, "icon.png");
var opsys = process.platform;
let trayApp = null;
var status = "enabled"; //Application is in disabled mode at start up
var intervalID;
var interval = 0;
const WindowsBalloon = require("node-notifier").WindowsBalloon;
const notifier = require("node-notifier");

var winNotifier = new WindowsBalloon({
  withFallback: false,
  customPath: void 0,
});

function sendNotification() {
  console.log(winNotifier);
  if (opsys == "darwin") {
    opsys = "MacOS";
  } else if (opsys == "win32" || opsys == "win64") {
    winNotifier.notify(
      {
        title: "BreakTime Buddy",
        message: "Test 1",
        sound: true,
        wait: true, // Wait for User Action against Notification
        type: "warn", // The notification type : info | warn | error
      },
      function (err, response) {
        console.log(err);
        console.log(response);
      }
    );
  } else if (opsys == "linux") {
    notifier.notify(
      {
        title: "BreakTime Buddy",
        message: "Test 1",
        sound: true,
        wait: true, // Wait for User Action against Notification
        type: "warn", // The notification type : info | warn | error
      },
      function (err, response) {
        console.log(err);
        console.log(response);
      }
    );
  }
}
function startNewInterval() {
  clearInterval(intervalID);
  if (status === "enabled") {
    intervalID = setInterval(function () {
      sendNotification();
    }, interval);
  }
}

function getContextMenu() {
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
            clearInterval(intervalID);
            interval=0;
          }
          trayApp.setContextMenu(getContextMenu());
        },
      },
    {
      label: "10 minutes",
      type: "checkbox",
      checked: interval == (60000 * 10),
      click: function () {
        if (interval === (60000 * 10)) {
          interval = 0;
          clearInterval(intervalID);
        } else {
            interval=(60000 * 10);
            startNewInterval();
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
      label: "Exit",
      click: function () {
        app.exit();
      },
    },
  ]);
  return contextMenu;
}

app.on("ready", () => {
  trayApp = new Tray(iconPath);
  var contextMenu = getContextMenu();
  trayApp.setToolTip("BreakTime Buddy");
  trayApp.setContextMenu(contextMenu);
});
