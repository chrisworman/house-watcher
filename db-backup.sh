#!/bin/sh
timestamp=`date +%Y-%m-%d.%H:%M:%S`
filename="./dbBackups/houses-backup-$timestamp.json"
mongoexport --db house-watcher --collection houses --out "$filename"
