function Cell(x, y) {
    this.x = x;
    this.y = y;
    this.start = false;
    this.end = false;
    this.block = false;
    this.visited = false;
    this.parent = null;
    this.globalGoal = Number.MAX_SAFE_INTEGER;
    this.localGoal = Number.MAX_SAFE_INTEGER;
    this.neighbours = Array();
}

var cells; 

var CHANCE = 0.3;

var ROWS = 20;
var CELL_WIDTH = 40;
var CELL_HEIGHT = 40;
var BORDER = 8;

var CELL_COLOR = "DimGrey";
var BLOCK_COLOR = "Black";
var VISITED_COLOR = "Grey";
var START_COLOR = "Yellow";
var END_COLOR = "Blue";
var PATH_COLOR = "Blue";
var CONNECTION_COLOR = "Orange";

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}

function solveAStarPath(cells, startCell, endCell) {
    for (var i = 0; i < cells.length; i++) {
            cells[i].visited = false;
            cells[i].parent = null;
            cells[i].globalGoal = Number.MAX_SAFE_INTEGER;
            cells[i].localGoal = Number.MAX_SAFE_INTEGER;
    }
    var current = startCell;
    current.localGoal = 0.0;
    current.globalGoal = distance(startCell.x, startCell.y, endCell.x, endCell.y);
    
    var notTestedCells = Array();
    notTestedCells.push(startCell);
    
    while (notTestedCells.length > 0 && current != endCell) {
        
        notTestedCells.sort(function(a, b) {
            return a.globalGoal - b.globalGoal;
        });

        while (notTestedCells.length > 0 && notTestedCells[0].visited) {
            notTestedCells.shift();
        }

        if (notTestedCells.length == 0) {
            break;
        }

        current = notTestedCells[0];
        current.visited = true;

        for (var i = 0; i < current.neighbours.length; i++) {
            var n = current.neighbours[i];
            if (!n.visited && !n.block) {
                notTestedCells.push(n);
            }
            var possiblyLowerGoal = current.localGoal + distance(current.x, current.y, n.x, n.y);

            if (possiblyLowerGoal < n.localGoal) {
                n.parent = current;
                n.localGoal = possiblyLowerGoal;
                n.globalGoal = n.localGoal + distance(n.x, n.y, endCell.x, endCell.y);
            }
        }
    }
}

function drawPath(ctx, endCell) {
    var node = endCell;
    while (node.parent) {
        var startX = node.x * CELL_WIDTH + CELL_HEIGHT / 2;
        var startY = node.y * CELL_HEIGHT + CELL_HEIGHT / 2;
        var endX = node.parent.x * CELL_WIDTH + CELL_HEIGHT / 2;
        var endY = node.parent.y * CELL_HEIGHT + CELL_HEIGHT / 2;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = PATH_COLOR;
        ctx.lineWidth = 2;
        ctx.stroke();
        node = node.parent;
    }
}

function drawCells(ctx, cells) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        for (var j = 0; j < cell.neighbours.length; j++) {
            var n = cell.neighbours[j];
            var startX = cell.x * CELL_WIDTH + CELL_HEIGHT / 2;
            var startY = cell.y * CELL_HEIGHT + CELL_HEIGHT / 2;
            var endX = n.x * CELL_WIDTH + CELL_HEIGHT / 2;
            var endY = n.y * CELL_HEIGHT + CELL_HEIGHT / 2;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = CONNECTION_COLOR;
            ctx.lineWidth = 6;
            ctx.stroke();
        }
    }
    for (var i = 0; i < cells.length; i++) { 
        var cell = cells[i];
        var x = cell.x * CELL_WIDTH;
        var y = cell.y * CELL_HEIGHT;
        x = x + BORDER;
        y = y + BORDER;
        ctx.fillStyle = CELL_COLOR;
        if (cell.block) {
            ctx.fillStyle = BLOCK_COLOR;
        }
        if (cell.visited) {
            ctx.fillStyle = VISITED_COLOR;
        }
        if (cell.start) {
            ctx.fillStyle = START_COLOR;
        }
        if (cell.end) {
            ctx.fillStyle = END_COLOR;
        }
        ctx.fillRect(x, y, CELL_WIDTH - (2 * BORDER), CELL_HEIGHT - (2 * BORDER));
    }
}

var ctrl = false;
var shift = false;

document.addEventListener("keydown", function(event) {
    if (event.keyCode == 17) {
        ctrl = true;
    }
    if (event.keyCode == 16) {
        shift = true;
    }
});
document.addEventListener("keyup", function(event) {
    if (event.keyCode == 17) {
        ctrl = false;
    }
    if (event.keyCode == 16) {
        shift = false;
    }
});

document.addEventListener("DOMContentLoaded", function() {
	var canvas = document.getElementById("field");
    var ctx = canvas.getContext('2d');
    var btn = document.getElementById("generate");
    btn.addEventListener("click", function(event) {
        CHANCE = document.getElementById("chance").value;
        cells = createMaze();
        cells[0].start = true;
        startCell= cells[0];
        cells[250].end = true;
        endCell = cells[250];
    
        solveAStarPath(cells, startCell, endCell);
        drawCells(ctx, cells);
        drawPath(ctx, endCell);
    });

    canvas.addEventListener("click", function(event) {
        event.preventDefault();
        var elemLeft = canvas.offsetLeft;
        var elemTop = canvas.offsetTop;
        var x = event.pageX - elemLeft;
        var y = event.pageY - elemTop;
        x = Math.floor(x / CELL_WIDTH);
        y = Math.floor(y / CELL_HEIGHT);
        cell = cells[x * ROWS + y];
        if (ctrl) {
            for (var i = 0; i < cells.length; i++) {
                cells[i].start = false;
            }
            cell.start = true;
            startCell = cell;
            solveAStarPath(cells, startCell, endCell);
            drawCells(ctx, cells);
            drawPath(ctx, endCell);
        }
        if (shift) {
            for (var i = 0; i < cells.length; i++) {
                cells[i].end = false;
            }
            cell.end = true;
            endCell = cell;
            solveAStarPath(cells, startCell, endCell);
            drawCells(ctx, cells);
            drawPath(ctx, endCell);
        }
        return false;
    });

    canvas.addEventListener("contextmenu", function(event) {
        event.preventDefault();
        var elemLeft = canvas.offsetLeft;
        var elemTop = canvas.offsetTop;
        var x = event.pageX - elemLeft;
        var y = event.pageY - elemTop;
        x = Math.floor(x / CELL_WIDTH);
        y = Math.floor(y / CELL_HEIGHT);
        cell = cells[x * ROWS + y];
        cell.block = !cell.block;
        solveAStarPath(cells, startCell, endCell);
        drawCells(ctx, cells);
        drawPath(ctx, endCell);
        return false;
    });

    var startCell= null;
    var endCell = null;

    cells = createMaze();

    cells[0].start = true;
    startCell= cells[0];
    cells[250].end = true;
    endCell = cells[250];

    solveAStarPath(cells, startCell, endCell);
    drawCells(ctx, cells);
    drawPath(ctx, endCell);

});

function createMaze() {
    var cells = Array();
    for (var i = 0; i < ROWS; i++) {
        for (var j = 0; j < ROWS; j++) {
            var c = new Cell(i, j);
            cells.push(c);
        }
    }

    
    for (var x = 0; x < ROWS; x++) {
        for (var y = 0; y < ROWS; y++) {
            if (y > 0 && Math.random() < CHANCE) {
                cells[y * ROWS + x].neighbours.push(cells[(y - 1) * ROWS + (x + 0)]);
                cells[(y - 1) * ROWS + (x + 0)].neighbours.push(cells[y * ROWS + x]);
            }
            if (y < ROWS - 1 && Math.random() < CHANCE){
                cells[y * ROWS + x].neighbours.push(cells[(y + 1) * ROWS + (x + 0)]);
                cells[(y + 1) * ROWS + (x + 0)].neighbours.push(cells[y * ROWS + x]);
            }
            if (x > 0 && Math.random() < CHANCE) {
                cells[y * ROWS + x].neighbours.push(cells[(y + 0) * ROWS + (x - 1)]);
                cells[(y + 0) * ROWS + (x - 1)].neighbours.push(cells[y * ROWS + x]);
            }
            if (x < ROWS - 1 && Math.random() < CHANCE) {
                cells[y * ROWS + x].neighbours.push(cells[(y + 0) * ROWS + (x + 1)]);
                cells[(y + 0) * ROWS + (x + 1)].neighbours.push(cells[y * ROWS + x]);
            }

            if (y > 0 && x > 0 && Math.random() < CHANCE) {
                cells[y * ROWS + x].neighbours.push(cells[(y - 1) * ROWS + (x - 1)]);
                cells[(y - 1) * ROWS + (x - 1)].neighbours.push(cells[y * ROWS + x]);
            }
            if (y < ROWS - 1 && x > 0 && Math.random() < CHANCE) {
                cells[y * ROWS + x].neighbours.push(cells[(y + 1) * ROWS + (x - 1)]);
                cells[(y + 1) * ROWS + (x - 1)].neighbours.push(cells[y * ROWS + x]);
            }
            if (y  >0 && x < ROWS - 1 && Math.random() < CHANCE) {
                cells[y * ROWS + x].neighbours.push(cells[(y - 1) * ROWS + (x + 1)]);
                cells[(y - 1) * ROWS + (x + 1)].neighbours.push(cells[y * ROWS + x]);
            }
            if (y < ROWS - 1 && x < ROWS - 1 && Math.random() < CHANCE) {
                cells[y * ROWS + x].neighbours.push(cells[(y + 1) * ROWS + (x + 1)]);
                cells[(y + 1) * ROWS + (x + 1)].neighbours.push(cells[y * ROWS + x]);
            }
        }
    }
    return cells;
}