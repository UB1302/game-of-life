const cellHeight = 20;
const cellWidth = 20;

const app = document.getElementById("app");
const canvas = document.createElement("canvas");
canvas.width = 600;
canvas.height = 600;
app.appendChild(canvas);
const ctx = canvas.getContext("2d");

const rows = Math.floor(canvas.width / cellWidth);
const cols = Math.floor(canvas.height / cellHeight);
let grid;
let animationId;
let isRunning = false;

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
                    j * cellWidth,
                    i * cellHeight,
                    cellWidth,
                    cellHeight
                );
                ctx.fillRect(
                    j * cellWidth,
                    i * cellHeight,
                    cellWidth - 1,
                    cellHeight - 1
                );
            } else {
                ctx.clearRect(
                    j * cellWidth,
                    i * cellHeight,
                    cellWidth - 1,
                    cellHeight - 1
                );
                ctx.strokeRect(
                    j * cellWidth,
                    i * cellHeight,
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
});

document.getElementById("next").addEventListener("click", () => {
    nextGrid();
    drawGrid();
});

document.getElementById("stop").addEventListener("click", () => {
    isRunning = false;
    cancelAnimationFrame(animationId);
});

document.getElementById("reset").addEventListener("click", () => {
    isRunning = false;
    cancelAnimationFrame(animationId);
    grid = createGrid();
    drawGrid();
});

canvas.addEventListener("click", function (event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let row = Math.floor(y / cellHeight);
    let col = Math.floor(x / cellWidth);

    grid[row][col] = grid[row][col] ? 0 : 1;
    drawGrid();
});

main();


// check with some knows patterns to verify if it is working correctly or not
