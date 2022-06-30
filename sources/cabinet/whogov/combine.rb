#!/bin/env ruby
# frozen_string_literal: true

require 'csv'
require 'pry'

data = CSV.parse(ARGF.read, headers: true)

grouped = data.group_by { |row| row.values_at('itemLabel', 'positionLabel') }.flat_map do |_, mems|
  mems.slice_when { |before, after| after['start'].to_i != before['end'].to_i + 1 }.map do |rows|
    rows.first['end'] = rows.last['end']
    rows.first
  end
end

puts data.headers.to_csv
puts grouped.map(&:to_csv)
