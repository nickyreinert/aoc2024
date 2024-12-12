antinodes = {} # positions/indexes of antinodes

map_width = 50
map_height = 50

file_content = File.read("input.txt").strip.gsub(/\s+/, '')

from_char_array = file_content.strip.chars

puts "found #{from_char_array.length} cells on the map"
from_char_array.each_with_index do |from_char, from_index|
    next if from_char == "."

    from_char_array[(from_index + 1)..-1].each_with_index do |to_char, to_index|
        next unless from_char == to_char

        from_row = (from_index / map_height).floor
        from_col = from_index - (from_row * map_width)

        to_row = ((from_index + to_index + 1) / map_height).floor
        to_col = (from_index + to_index + 1) - (to_row * map_width)

        puts "Found couple of #{from_char} at #{from_row}/#{from_col} and at #{to_row}/#{to_col}"

        first_antinode_row = from_row - (to_row - from_row)
        second_antinode_row = to_row + (to_row - from_row)

        first_antinode_col = from_col + (from_col - to_col)
        second_antinode_col = to_col + (to_col - from_col)

        if first_antinode_row.between?(0, map_height - 1) && first_antinode_col.between?(0, map_width - 1)
            antinodes["#{first_antinode_row}/#{first_antinode_col}"] = "#"
        end
        
        if second_antinode_row.between?(0, map_height - 1) && second_antinode_col.between?(0, map_width - 1)
            antinodes["#{second_antinode_row}/#{second_antinode_col}"] = "#"
        end
        
    end
end



# puts antinodes
puts "found #{antinodes.length} antinodes"
