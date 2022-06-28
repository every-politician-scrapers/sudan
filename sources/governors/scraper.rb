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
      noko.xpath('//table[.//tr[contains(., "Portrait")]]//tr[td]')
    end
  end

  class Member
    field :id do
      tds[2].css('a/@wikidata').text
    end

    field :name do
      tds[2].css('a').text
    end

    field :state do
      tds[0].css('a/@wikidata').text
    end

    field :stateLabel do
      tds[0].css('a').text
    end

    field :position do
    end

    field :positionLabel do
      "Governor of #{stateLabel}"
    end

    field :startDate do
      WikipediaDate.new(tds[3].text.tidy).to_s
    end

    private

    def tds
      noko.css('td')
    end
  end
end

url = ARGV.first
puts EveryPoliticianScraper::ScraperData.new(url).csv
