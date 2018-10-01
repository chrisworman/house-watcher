var scraper = require('./scraper.js');
var CronJob = require('cron').CronJob;

const job = new CronJob('00 00 18 * * *', function() {
  scraper.scrape();
});

job.start();
