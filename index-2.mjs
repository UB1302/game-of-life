const cellHeight = 20;
const cellWidth = 20;

const app = document.getElementById("app");
const canvas = document.createElement("canvas");
canvas.width = 600;
canvas.height = 600;
app.appendChild(canvas);
const ctx = canvas.getContext("2d");
let animationId;
let isRunning = false;

const rows = Math.floor(canvas.width / cellWidth);
const cols = Math.floor(canvas.height / cellHeight);
let grid;
console.log(rows, cols)

const create2DArray = () => {
    let arr = new Array(rows);
    for (let i = 0; i < rows; i++) {
        arr[i] = new Array(cols);
    }
    return arr;
};

const createGrid = () => {
    const grid = create2DArray(rows, cols);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            // if( (i === 12 && j === 14) ||
            // (i === 13 && j === 15) ||
            // (i === 14 && j === 14) ||
            // (i === 14 && j === 15) ||
            // (i === 14 && j === 13)){
            //     grid[i][j] = 1
            // }else{
            //     grid[i][j] = 0
            // }
            grid[i][j] = generateRandomNumber(2);
        }
    }

    return grid;
};

const generateRandomNumber = (max) => {
    return Math.floor(Math.random() * max);
};

const drawGrid = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === 1) {
                ctx.fillStyle = "yellow";
                ctx.strokeRect(
                    i * cellWidth,
                    j * cellHeight,
                    cellWidth,
                    cellHeight
                );
                ctx.fillRect(
                    i * cellWidth,
                    j * cellHeight,
                    cellWidth - 1,
                    cellHeight - 1
                );
            } else {
                ctx.clearRect(
                    i * cellWidth,
                    j * cellHeight,
                    cellWidth - 1,
                    cellHeight - 1
                );
                ctx.strokeRect(
                    i * cellWidth,
                    j * cellHeight,
                    cellWidth,
                    cellHeight
                );
            }
        }
    }
};

const nextGrid = () => {
    let newGrid = create2DArray(rows, cols);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let liveNeighbours = countLiveNeighbours(i, j);
            // console.log(liveNeighbours, i, j);
            if (grid[i][j] === 0 && liveNeighbours === 3) {
                newGrid[i][j] = 1;
            } else if (
                grid[i][j] === 1 &&
                (liveNeighbours < 2 || liveNeighbours >= 4)
            ) {
                newGrid[i][j] = 0;
            } else {
                newGrid[i][j] = grid[i][j];
            }
        }
    }
    grid = newGrid;
};

const countLiveNeighbours = (x, y) => {
    let liveNeighbours = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let row = (x + i + rows) % rows;
            let col = (y + j + cols) % cols;

            liveNeighbours += grid[row][col];
        }
    }
    liveNeighbours -= grid[x][y];
    return liveNeighbours;
};

const main = () => {
    grid = createGrid();
    // console.table(grid)
    drawGrid();
};

const drawNextGrid = () => {
    nextGrid();
    drawGrid();
    if (isRunning) {
        animationId = requestAnimationFrame(drawNextGrid);
    }
};

document.getElementById("start").addEventListener("click", () => {
    if (!isRunning) {
        isRunning = true;
        drawNextGrid();
    }
    // setInterval(drawNextGrid,1000)
});

document.getElementById("next").addEventListener("click", () => {
    nextGrid();
    drawGrid();
});

document.getElementById("stop").addEventListener("click", () => {
    isRunning = false;
    cancelAnimationFrame(animationId);
    // console.log("abc");
});

document.getElementById("reset").addEventListener("click", () => {
    isRunning = false;
    cancelAnimationFrame(animationId);
    grid = createGrid();
    drawGrid();
    // console.log("abc");
});

canvas.addEventListener("click", function (event) {
    // Step 3: Handle the click event
    // You can get the mouse coordinates relative to the canvas like this:
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Example action: Log the coordinates
    console.log(`Clicked at (${x}, ${y})`);
});

main();

// on click on grid cell activate or deactivate

// handle wrap around logic
