#!/bin/env ruby
# frozen_string_literal: true

require 'every_politician_scraper/comparison'

class Comparison < EveryPoliticianScraper::DecoratedComparison
  def columns
    super | %i[startdate enddate item]
  end
end

# Not listed on the site
SKIP = [
].freeze

diff = Comparison.new('wikidata.csv', 'scraped.csv').diff.reject { |row| SKIP.include? row }
puts diff.sort_by { |r| [r.first, r.last.to_s] }.reverse.map(&:to_csv)
