const schedule = require("node-schedule");

// Schedule a job to run every 2 seconds
const cron = schedule.scheduleJob("*/5  * * * *", () => {
  console.log("I am ...");
});
