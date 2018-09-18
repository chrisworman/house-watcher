var scraper = require('./index.js');
var CronJob = require('cron').CronJob;

const job = new CronJob('00 00 18 * * *', function() {
  scraper.scrape(1);
});

job.start();
