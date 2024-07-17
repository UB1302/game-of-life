// Note - replacing old grid with new grid, not handling the edges
const rows = 30;
const cols = 30;

const generateRandomInt = (max) => {
    return Math.floor(Math.random() * max);
};

const app = document.getElementById("app");
let gridContainer = document.createElement("div");
gridContainer.classList.add("container");
let currentGridId = generateRandomInt(50); // why this error  - Cannot access 'generateRandomInt' before initialization
let newGridId;
gridContainer.id = currentGridId;
app.appendChild(gridContainer);
let nextBtn = document.getElementById("next");
nextBtn.addEventListener("click", () => {
    next();
});

const make2DArray = (rows, cols) => {
    let arr = new Array(rows);

    for (let i = 0; i < rows; i++) {
        arr[i] = new Array(cols);
    }
    // console.log(arr)
    return arr;
};

// make2DArray(10,10)

const generateGrid = () => {
    let grid = make2DArray(rows, cols);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let gridCell = document.createElement("div");
            gridCell.id = `${i},${j}`;
            gridCell.dataset.index = [i, j];
            gridCell.addEventListener("click", () => {
                gridCell.classList.toggle("grid-item-active");
            });
            gridCell.classList.add("grid-item");
            gridContainer.appendChild(gridCell);
        }
    }
    setup();
    return;
};

const setup = () => {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let gridCell = document.getElementById(`${i},${j}`);
            
            if (generateRandomInt(2)) {
                gridCell.classList.add("grid-item-active");
            }
            // if (
            //     (i === 12 && j === 14) ||
            //     (i === 13 && j === 15) ||
            //     (i === 14 && j === 14) ||
            //     (i === 14 && j === 15) ||
            //     (i === 14 && j === 13)
            // ) {
            //     gridCell.classList.add("grid-item-active");
            // }
        }
    }

    next();

    // abc()
    // setInterval(next,100)
};

const next = () => {
    console.time();
    let newContainer = document.createElement("div");
    newContainer.classList.add("container");
    newGridId = generateRandomInt(50);
    newContainer.id = newGridId;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            // let gridCell = document.getElementById(`${i},${j}`)
            // if (i === 0 || i === cols - 1 || j === 0 || j === cols - 1) {
            //     let oldGridCell = document.getElementById(`${i},${j}`);

            //     let gridCell = document.createElement("div");
            //     gridCell.id = `${i},${j}`;
            //     gridCell.addEventListener("click", () => {
            //         gridCell.classList.toggle("grid-item-active");
            //     });
            //     gridCell.classList.add("grid-item");
            //     if (oldGridCell.classList.contains("grid-item-active")) {
            //         gridCell.classList.add("grid-item-active");
            //     }
            //     newContainer.appendChild(gridCell);
            // } else {
                let { numberOfDeadNeighbours, numberOfAliveNeighbours } =
                    calculateNeighbours(i, j);
                let oldGridCell = document.getElementById(`${i},${j}`);
                let isOldGridCellLive = false;
                if (oldGridCell.classList.contains("grid-item-active")) {
                    isOldGridCellLive = true;
                }

                let gridCell = document.createElement("div");
                gridCell.id = `${i},${j}`;
                gridCell.addEventListener("click", () => {
                    gridCell.classList.toggle("grid-item-active");
                });
                gridCell.classList.add("grid-item");

                if (numberOfAliveNeighbours === 3 && !isOldGridCellLive) {
                    gridCell.classList.add("grid-item-active");
                    newContainer.appendChild(gridCell);
                } else if (
                    (numberOfAliveNeighbours < 2 ||
                        numberOfAliveNeighbours >= 4) &&
                    isOldGridCellLive
                ) {
                    
                    gridCell.classList.remove("grid-item-active");
                    newContainer.appendChild(gridCell);
                } else {
                    // gridCell.classList.add("grid-item-active");
                    let oldGridCell = document.getElementById(`${i},${j}`);
                    let gridCell = document.createElement("div");
                    gridCell.id = `${i},${j}`;
                    gridCell.addEventListener("click", () => {
                        gridCell.classList.toggle("grid-item-active");
                    });
                    gridCell.classList.add("grid-item");
                    if (oldGridCell.classList.contains("grid-item-active")) {
                        gridCell.classList.add("grid-item-active");
                    }
                    newContainer.appendChild(gridCell);
                }
            // }
        }
    }

    let currentGrid = document.getElementById(currentGridId);

    currentGridId = newGridId;

    currentGrid.parentNode.replaceChild(newContainer, currentGrid);
    console.timeEnd();
    return;
};

const calculateNeighbours = (x, y) => {
    let numberOfDeadNeighbours = 0;
    let numberOfAliveNeighbours = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            // let a = x + i;
            // let b = y + j;
            let a = (x + i + rows) % rows;
            let b = (y + j + cols) % cols;

            if (a === x && b === y) {
            } else {
                let gridCell = document.getElementById(`${a},${b}`);

                if (gridCell.classList.contains("grid-item-active")) {
                    numberOfAliveNeighbours += 1;
                } else {
                    numberOfDeadNeighbours += 1;
                }
            }
        }
    }

    return { numberOfDeadNeighbours, numberOfAliveNeighbours };
};

generateGrid();
