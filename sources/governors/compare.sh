#!/bin/bash

cd $(dirname $0)

bundle exec ruby scraper.rb $(jq -r .source meta.json) |
  qsv select id,name,position,positionLabel,state,stateLabel,startDate |
  qsv rename item,itemLabel,position,positionLabel,state,stateLabel,startDate > scraped.csv

wd sparql -f csv wikidata.js |
  sed -e 's/T00:00:00Z//g' -e 's#http://www.wikidata.org/entity/##g' |
  # qsv dedup -s psid |
  qsv select item,name,position,positionLabel,state,stateLabel,start,source,sourceDate,psid |
  qsv rename item,itemLabel,position,positionLabel,state,stateLabel,startDate,source,sourceDate,psid > wikidata.csv

bundle exec ruby diff.rb | tee diff.csv

cd ~-
