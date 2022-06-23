#!/bin/bash

cd $(dirname $0)

# scraped.csv manually created from source

wd sparql -f csv wikidata.js | sed -e 's/T00:00:00Z//g' -e 's#http://www.wikidata.org/entity/##g' | qsv dedup -s psid | qsv sort -s itemLabel,startDate > wikidata.csv
bundle exec ruby diff.rb | qsv search -s '@@' -v -- '---' | qsv sort -s itemlabel | tee diff.csv

cd ~-
