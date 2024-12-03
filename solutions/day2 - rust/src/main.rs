// src/main.rs
use std::fs::File;
use std::io::{self, BufRead, BufReader};

fn is_valid(differences: &Vec<i32>) -> bool {
    // Check if all differences are positive or all are negative
    let all_positive_or_negative = differences.iter().all(|&difference| difference > 0)
        || differences.iter().all(|&difference| difference < 0);

    // Check if all differences are within the absolute range [1, 3]
    let within_abs_range = differences.iter().all(|&difference| difference.abs() >= 1 && difference.abs() <= 3);

    all_positive_or_negative && within_abs_range
}

fn main() -> io::Result<()> {

    let file: File = File::open("input.txt")?;

    let lines: Vec<String> = BufReader::new(file)
        .lines()
        .collect::<Result<Vec<String>, _>>()?;
            
    let mut valid_count = 0;

    for (_i, line) in lines.iter().enumerate() {
        let numbers: Vec<i32> = line    
            .split_whitespace()
            .map(|s| s.parse().unwrap())
            .collect();

        println!("Parsed numbers: {:?}", numbers);

        // first get differences between two adjcent numbers
        let mut differences: Vec<i32> = Vec::new();

        for j in 1..numbers.len() {

            differences.push(numbers[j] - numbers[j - 1]); // * de-references the variable
        
        }

        println!("\tParsed differences: {:?}", differences);

        // all differences are either positive or negative and difference is in range [1, 2, 3] 
        if is_valid(&differences) {

            println!("\tValid!");

            valid_count += 1;

        // if not, can we make it valid by removing on item from the list of numbers?
        } else {
        
            for (index, _) in numbers.iter().enumerate() {
                // Clone the vector so we can test a version with one item removed
                let mut fixed_numbers = numbers.clone();
            
                // Remove the item at the current index
                fixed_numbers.remove(index);

                // first get differences between two adjcent numbers
                let mut fixed_differences: Vec<i32> = Vec::new();

                for j in 1..fixed_numbers.len() {

                    fixed_differences.push(fixed_numbers[j] - fixed_numbers[j - 1]); // * de-references the variable
                
                }

                // Check if the modified differences satisfy the condition
                if is_valid(&fixed_differences) {
                
                    println!("\tFixed differences: {:?}", fixed_differences);
                    println!("\tValid after fixing!");
                    valid_count += 1;
                    break; // Exit the loop if you find a valid configuration
                }
            }

        }

    }

    println!("Total valid lines: {}", valid_count);  // Print it
    Ok(())

}
