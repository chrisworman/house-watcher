#!/bin/sh
timestamp=`date +%Y-%m-%d.%H:%M:%S`
filename="houses-backup-$timestamp.json"
mongoexport --db house-watcher --collection houses --out "$filename"
