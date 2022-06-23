#!/bin/env ruby
# frozen_string_literal: true

require 'every_politician_scraper/scraper_data'
require 'pry'

class MemberList
  class Members
    decorator RemoveReferences
    decorator UnspanAllTables
    decorator WikidataIdsDecorator::Links

    def member_container
      noko.xpath("//table[.//th[contains(.,'Incumbent')]]//tr[td]")
    end
  end

  class Member
    field :id do
      name_node.attr('wikidata')
    end

    field :name do
      name_node.text.tidy
    end

    field :positionID do
    end

    field :position do
      tds[0].text.tidy
    end

    field :startDate do
      datestr(3)
    end

    field :endDate do
      datestr(4)
    end

    private

    def tds
      noko.css('td')
    end

    def name_node
      tds[1].css('a').first
    end

    def datestr(colno)
      rawdate = tds[colno].text.tidy
      return if rawdate.to_s.empty?

      Date.parse(rawdate).to_s
    end
  end
end

url = ARGV.first
puts EveryPoliticianScraper::ScraperData.new(url).csv
