#!/bin/bash

cd $(dirname $0)

curl -LsS https://github.com/every-politician-scrapers/shared/raw/main/wpoffice.tgz | tar xfz - --strip-components=1
cp wikidata-local.js wikidata.js
bash run-comparison.sh
git clean -qfX

cd ~-
