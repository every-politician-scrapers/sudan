#!/bin/bash

# This is a static source that has already been imported in full, so there's no
# need to keep running the comparison

cd $(dirname $0)

qsv join --left position cpssa.csv raw reconciled-positions.csv |
  qsv select minister,position\[1\],raw,startdate,enddate |
  qsv join --left minister - name reconciled-people.csv |
  qsv select id,minister,position,raw,startdate,enddate |
  qsv rename item,itemLabel,position,positionLabel,startDate,endDate > scraped.csv

wd sparql -f csv wikidata.js | sed -e 's/T00:00:00Z//g' -e 's#http://www.wikidata.org/entity/##g' | qsv dedup -s psid | qsv sort -s itemLabel,startDate > wikidata.csv

bundle exec ruby diff.rb | qsv sort -s itemlabel,positionlabel | qsv search -v -- '---' | tee diff.csv

cd ~-
