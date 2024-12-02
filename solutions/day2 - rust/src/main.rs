// src/main.rs
use std::fs::File;
use std::io::{self, BufRead, BufReader};

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

        println!("Parsed differences: {:?}", differences);

        if (differences.iter().all(|&difference| difference > 0) ||
            differences.iter().all(|&difference| difference < 0)) &&
            differences.iter().all(|&difference| difference.abs() >= 1 && difference.abs() <= 3) {

            println!("Valid!");

            valid_count += 1;

        }

    }

    println!("Total valid lines: {}", valid_count);  // Print it
    Ok(())

}
