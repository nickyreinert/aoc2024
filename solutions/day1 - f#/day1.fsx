// aoc_1.fsx
// https://adventofcode.com/2024/day/1#part1
// Maybe the lists are only off by a small amount! To find out, pair up the numbers and measure how far apart they are. Pair up the smallest number in the left list with the smallest number in the right list, then the second-smallest left number with the second-smallest right number, and so on.
// Within each pair, figure out how far apart the two numbers are; you'll need to add up all of those distances. For example, if you pair up a 3 from the left list with a 7 from the right list, the distance apart is 4; if you pair up a 9 with a 3, the distance apart is 6.


open System
open System.IO

let readListFromFile (filePath: string) =
    File.ReadAllLines(filePath) // Read the whole file as a string
    |> Array.map int // Convert each element to an integer
    |> Array.toList // Convert the array to a list


// Read lists from files
let list1 = readListFromFile "aoc_1_input_1.txt"
let list2 = readListFromFile "aoc_1_input_2.txt"

// Sort the lists in increasing order
let sortedList1 = List.sort list1
let sortedList2 = List.sort list2

// Calculate the absolute differences between corresponding elements
let absoluteDifferences = 
    List.mapi (fun index value1 -> 
        abs (value1 - (List.item index sortedList2))
    ) sortedList1

let sumOfDifferences = List.sum absoluteDifferences

printfn "Part 1 solution: %d" sumOfDifferences // 2344935

// This time, you'll need to figure out exactly how often each number from the left list appears in the right list. Calculate a total similarity score by adding up each number in the left list after multiplying it by the number of times that number appears in the right list.

let productOfFrequencies : int List =
    List.mapi (fun index value1 -> // loop through each item of first list
    
        let frequency = 
            List.filter (fun x -> x = value1) sortedList2 // filter second list to contain only items matching current item of the first list
            |> List.length // count length and therefore occurences of the current item of the first list

        frequency * value1 // multiply by current item to get the frequency product

    ) sortedList1

let sumOfProductOfFrequencies = List.sum productOfFrequencies

printfn "Part 1 solution: %d" sumOfProductOfFrequencies // 2344935
