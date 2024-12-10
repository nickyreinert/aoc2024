#include <iostream>
#include <sstream>
#include <fstream> 
#include <map>
#include <vector>
#include <string>


// Function to load file content into a vector of strings
std::vector<std::string> loadFromFile(const std::string& fileName) {
    std::ifstream inputFile(fileName);

    if (!inputFile.is_open()) {
        throw std::runtime_error("Error: Could not open the file " + fileName);
    }

    std::string line;
    std::vector<std::string> inputData;

    while (std::getline(inputFile, line)) {
        inputData.push_back(line);
    }

    inputFile.close();
    return inputData;
}

// Function to parse a single line into a key-value pair
std::pair<unsigned long long, std::vector<unsigned long long>> parseLineToDictionaryEntry(const std::string& line) {
    std::istringstream iss(line);
    unsigned long long key;
    char colon;
    std::vector<unsigned long long> values;

    // Parse the key and the colon
    iss >> key >> colon;

    if (colon != ':') {
        throw std::runtime_error("Invalid format in line: " + line);
    }

    // Parse the values
    unsigned long long value;
    while (iss >> value) {
        values.push_back(value);
    }

    return {key, values};
}

// Function to parse multiple lines into a dictionary
std::map<unsigned long long, std::vector<unsigned long long>> parseStringToDictionary(const std::vector<std::string>& inputData) {
    std::map<unsigned long long, std::vector<unsigned long long>> dictionary;
    
    for (const auto& line : inputData) {
        auto entry = parseLineToDictionaryEntry(line);

        // Check if the key already exists in the map
        // if (dictionary.find(entry.first) != dictionary.end()) {
        //     // If key exists, throw an exception
        //     throw std::runtime_error("Duplicate key found: " + std::to_string(entry.first) + ". Line: " + line);
        // }
        dictionary[entry.first] = entry.second;
    
    }

    return dictionary;
}

void generatePermutations(int n, const std::string& current, std::vector<std::string>& result) {
    if (current.length() == n) {
        result.push_back(current);
        return;
    }

    // Add "+" to the current string and recurse
    generatePermutations(n, current + "+", result);
    // Add "*" to the current string and recurse
    generatePermutations(n, current + "*", result);
}


int main() {

    try {

        // Load data from file
        const std::string fileName = "input.txt";
        std::vector<std::string> inputData = loadFromFile(fileName);

        // Parse the data into a dictionary
        std::map<unsigned long long, std::vector<unsigned long long>> equations = parseStringToDictionary(inputData);
        
        std:unsigned long long valid_equations_sum = 0;
    
        unsigned long long counter = 0;

        for (const std::pair<unsigned long long, std::vector<unsigned long long>>& entry : equations) {
            
            counter++;  // Increment the counter for each iteration

            std::vector<std::string> listOfOperators;
            unsigned long long result = entry.first;
            std::vector<unsigned long long> operands;
            for (int operand : entry.second) {
                operands.push_back(static_cast<unsigned long long>(operand));
            }

            int operandsCount = operands.size();

            // loop through all possible permutations of operators 
            // which is 2^n because we have 2 operators (+, *) and n possible 
            // positions, where n is lenght of operands - 1, because
            // two operands only require on operator
            // x = a + b
            generatePermutations(operandsCount - 1, "", listOfOperators);  

            for (const auto& operators : listOfOperators) {

                unsigned long long test_result = operands[0];
                std::string output = std::to_string(operands[0]);

                for (size_t index = 1; index < operands.size(); ++index) {

                    if (operators[index - 1] == '+') {
                        test_result += operands[index];
                        output += " + " + std::to_string(operands[index]);
                        
                    } else if (operators[index - 1] == '*') {
                        test_result *= operands[index];
                        output += " * " + std::to_string(operands[index]);

                    } 

                    // this could speed up the loop
                    // because if test_result is already bigger than result
                    // this equation certainly is invalid
                    // if (test_result > result) {
                    //     break;
                    // }
                    
                }

                // after building one version of the equation,
                // check if it's result matches the wanted result
                // if yes, then we are done and we camn break out 
                // and go on with the next equation in the list
                if (test_result == result) {

                    std::cout << result << " = " << output << std::endl;

                    valid_equations_sum += result;

                    break;
                    
                }

            }
            
        }

        std::cout << "Final result: " << valid_equations_sum << std::endl;
        std::cout << "Processed lines: " << counter << std::endl;
        return 0;

    } catch (const std::exception& e) {
        std::cerr << e.what() << std::endl;
        return 1;
    }

}
