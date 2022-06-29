#!/bin/env ruby
# frozen_string_literal: true

require 'every_politician_scraper/scraper_data'
require 'pry'

class String
  def zeropad
    rjust(2, '0')
  end
end

class SlashedDMY < WikipediaDate
  def to_s
    date_en.to_s.split('/').reverse.map(&:zeropad).join('-')
  end
end

class OfficeholderList < OfficeholderListBase
  decorator RemoveReferences
  decorator WikidataIdsDecorator::Links

  def holder_entries
    noko.xpath("//h3[.//span[contains(.,'List of governors')]]//following-sibling::ul[1]//li")
  end

  class Officeholder < OfficeholderNonTableBase
    def name_node
      noko.css('a').last
    end

    def raw_combo_date
      noko.text.tidy.split(/\s(?=\d)/, 2).last
    end

    def date_class
      SlashedDMY
    end
  end
end

url = ARGV.first
puts EveryPoliticianScraper::ScraperData.new(url, klass: OfficeholderList).csv
