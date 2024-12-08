// solve.js

const limit_iterations = 999999;

const animation_delay = 10;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function loadInitialMap() {

    const text = 
"....#.....\n\
.........#\n\
..........\n\
..#.......\n\
.......#..\n\
..........\n\
.#..^.....\n\
........#.\n\
#.........\n\
......#..."

    return text.split('\n').map(line => line.split('')); 

}

// Function to render the map in the page (use console.log or modify this to display on the page)
function renderMap(map) {
    const mapContainer = document.createElement('div');  // Create a container for the map
    
    // Iterate over each row in the map
    map.forEach((row, rowIndex) => {
        // Create a container for this row
        const rowElement = document.createElement('div');
        
        // Iterate over each character in the row
        row.forEach((char, colIndex) => {
            const charElement = document.createElement('span');  // Create a <span> for each character
            charElement.textContent = char;  // Set the text of the span to the current character
            
            // Optionally, add unique classes or IDs for addressing later
            charElement.classList.add('map-char');  // Add a class for all map characters
            charElement.setAttribute('data-row', rowIndex);  // Set custom attribute for row
            charElement.setAttribute('data-col', colIndex);  // Set custom attribute for column
            
            rowElement.appendChild(charElement);  // Append the character to the row
        });
        
        mapContainer.appendChild(rowElement);  // Append the row to the map container
    });
    
    document.querySelector('#container').innerHTML = null;
    document.querySelector('#container').appendChild(mapContainer);  // Append the full map to the body

}

function findCaretPosition(map) {
    
    for (let rowIndex = 0; rowIndex < map.length; rowIndex++) {
        for (let colIndex = 0; colIndex < map[rowIndex].length; colIndex++) {
            if (map[rowIndex][colIndex] === '^') {
                return { row: rowIndex, col: colIndex }; 
            }
        }
    }
}

function  markPreviousPosition(row, col) {

    let el = document.querySelector(`[data-row="${row}"][data-col="${col}"]`)
    el.style.backgroundColor = 'orange';
    el.innerText = '.';

}

function markCurrentPosition(row, col, direction) {

    let el = document.querySelector(`[data-row="${row}"][data-col="${col}"]`)

    el.style.backgroundColor = 'red';

    switch (direction) {

        case "up":
            el.innerText = '^';
            break;

        case "right":
            el.innerText = '>';
            break;

        case "down":
            el.innerText = 'v';
            break;

        case "left":
            el.innerText = '<';
            break;


    }

}

function lookInDirection(row, col, direction, obstacle_positions) {

    let next_element = null;

    while (true) {

        if (obstacle_positions.length >= 3) {

            return obstacle_positions
    
        }
    
    
        switch (direction) {

            case "left":

                col -= 1;
                next_element = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        
                if (next_element == null) {return []}
                if (next_element.innerText != '.') {
                    obstacle_positions.push([row, col]);
                    lookInDirection(row, col + 1, "up", obstacle_positions);
                }
                break

            case "up":

                row -= 1;
                next_element = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        
                if (next_element == null) {return []}
                if (next_element.innerText != '.') {

                    obstacle_positions.push([row, col]);
                    lookInDirection(row + 1, col, "right", obstacle_positions);
                }
                break

            case "right":

                col += 1;
                next_element = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        
                if (next_element == null) {return []}
                if (next_element.innerText != '.') {
                    obstacle_positions.push([row, col]);
                    lookInDirection(row, col - 1, "down", obstacle_positions);
                }
                break

            case "down":

                row += 1;
                next_element = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        
                if (next_element == null) {return []}
                if (next_element.innerText != '.') {
                    obstacle_positions.push([row, col]);

                    lookInDirection(row - 1, col, "left", obstacle_positions);
                }
                break

        }

    }

}

function move(row, col, direction) {

    markPreviousPosition(row, col);

    let next_element = null;

    switch (direction) {

        case "up":

            next_element = document.querySelector(`[data-row="${row - 1}"][data-col="${col}"]`);

            if (next_element == null) {

                return false;

            }
            else if (next_element.innerText == '#') {
                direction = 'right';
                col += 1;
            } else {

                if (lookInDirection(row, col, "right", []).length >= 3) {
                    additional_obstacle_positions.push([row - 1, col]);
                    document.querySelector(`[data-row="${row - 1}"][data-col="${col}"]`).innerText = "O";
                }    
                row -= 1;
            }
            break;

        case "right":

            next_element = document.querySelector(`[data-row="${row}"][data-col="${col + 1}"]`); 
            
            if (next_element == null) {
                
                return false;
                
            }
            else if (next_element.innerText == '#') {
                direction = 'down';
                row += 1;
            } else {

                if (row == 1) {

                    console.log("right");

                }
                if (lookInDirection(row, col, "down", []).length >= 3) {
                    additional_obstacle_positions.push([row, col]);
                    document.querySelector(`[data-row="${row}"][data-col="${col}"]`).innerText = "O";
                }    
                col += 1;

            }
            break;

        case "down":

            next_element = document.querySelector(`[data-row="${row + 1}"][data-col="${col}"]`); 

            if (next_element == null) {

                return false;
                
            }
            else if (next_element.innerText == '#') {

                direction = 'left';
                col -= 1;

            } else {

                if (lookInDirection(row, col, "left", []).length >= 3) {
                    additional_obstacle_positions.push([row + 1, col]);
                    document.querySelector(`[data-row="${row + 1}"][data-col="${col}"]`).innerText = "O";
                }    
                row += 1;

            }
            break;

        case "left":

            next_element = document.querySelector(`[data-row="${row}"][data-col="${col - 1}"]`)
                        
            if (next_element == null) {

                return false;
                
            }
            else if  (next_element.innerText == '#') {
                direction = 'up';
                row -= 1;
            } else {

                if (lookInDirection(row, col, "up", []).length >= 3) {
                    additional_obstacle_positions.push([row, col - 1]);
                    document.querySelector(`[data-row="${row}"][data-col="${col - 1}"]`).innerText = "O";
                }    

                col -= 1;

            }
            break;
    
    }

    markCurrentPosition(row, col, direction);

    return { row: row, col: col, direction: direction}; 

}

async function solve(row, col, direction) {

    let i = 0;

    // Loop that runs 10 iterations
    while (true) {

        if (animation_delay > 0) await sleep(animation_delay);

        // Move and get new position
        let position = move(row, col, direction);

        if (!path.includes(`${row}-${col}`)) {
            path.push(`${row}-${col}`);

        }

        if (position == false) {
            
            const mapContainer = document.createElement('div');
            mapContainer.textContent = `Solved in ${path.length} steps`; 
            document.body.appendChild(mapContainer);
            break;
        }

        // Update position variables
        row = position.row;
        col = position.col;
        direction = position.direction;

        // Increment iteration count
        i += 1;

        // Stop loop after 10 iterations
        if (i > limit_iterations) break;
    }

}

let path = [];

let additional_obstacle_positions = [];

function init(map) {
    
    renderMap(map);
    
    path = [];
    
    direction = "up"
    
    const position = findCaretPosition(map);
    row = position.row; 
    col = position.col; 
    
    document.querySelector(`[data-row="${row}"][data-col="${col}"]`)
        .style.backgroundColor = 'red';
    
    solve(row, col, direction);

}

document.addEventListener('DOMContentLoaded', function() {

    const map = loadInitialMap();
    init(map);

    document.getElementById('fileInput').addEventListener('change', function(event) {

        const file = event.target.files[0];  // Get the selected file
        if (file) {
            const reader = new FileReader();  // Create a FileReader object
            reader.onload = function(e) {
                const fileContent = e.target.result;  // The file content
                const map = fileContent.split('\n').map(line => line.split(''));  // Convert it into a 2D array
                renderMap(map);  // Render the map
                init(map);
            };
            reader.readAsText(file);  // Read the file as text

        }
    });
});
