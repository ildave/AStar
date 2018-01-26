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

var ROWS = 20;
var CELL_WIDTH = 40;
var CELL_HEIGHT = 40;
var BORDER = 4;

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}

function solveAStarPath(cells, startCell, endCell) {
    console.log("astar start");
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
    console.log(notTestedCells);
    
    while (notTestedCells.length > 0 && current != endCell) {
        console.log("loop");
        
        notTestedCells.sort(function(a, b) {
            return a.globalGoal - b.globalGoal;
        });
        console.log(notTestedCells);

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
    
    console.log("astar end");
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
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 6;
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
            ctx.strokeStyle = "grey";
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
    for (var i = 0; i < cells.length; i++) { 
        var cell = cells[i];
        var x = cell.x * CELL_WIDTH;
        var y = cell.y * CELL_HEIGHT;
        x = x + BORDER;
        y = y + BORDER;
        ctx.fillStyle = "grey";
        if (cell.block) {
            ctx.fillStyle = "black";
        }
        if (cell.visited) {
            ctx.fillStyle = "orange";
        }
        if (cell.start) {
            ctx.fillStyle = "yellow";
        }
        if (cell.end) {
            ctx.fillStyle = "blue";
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
    console.log("load");

    canvas.addEventListener("click", function(event) {
        console.log(event);
        event.preventDefault();
        var elemLeft = canvas.offsetLeft;
        var elemTop = canvas.offsetTop;
        var x = event.pageX - elemLeft;
        var y = event.pageY - elemTop;
        console.log("click", x, y);
        x = Math.floor(x / CELL_WIDTH);
        y = Math.floor(y / CELL_HEIGHT);
        cell = cells[x * ROWS + y];
        console.log("clicked cell", cell);
        if (ctrl) {
            for (var i = 0; i < cells.length; i++) {
                cells[i].start = false;
            }
            console.log("ctrl click");
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
            console.log("shift click");
            cell.end = true;
            endCell = cell;
            solveAStarPath(cells, startCell, endCell);
            drawCells(ctx, cells);
            drawPath(ctx, endCell);
        }
        return false;
    });

    canvas.addEventListener("contextmenu", function(event) {
        console.log(event);
        event.preventDefault();
        var elemLeft = canvas.offsetLeft;
        var elemTop = canvas.offsetTop;
        var x = event.pageX - elemLeft;
        var y = event.pageY - elemTop;
        console.log("click", x, y);
        x = Math.floor(x / CELL_WIDTH);
        y = Math.floor(y / CELL_HEIGHT);
        cell = cells[x * ROWS + y];
        console.log("right clicked cell", cell);
        cell.block = !cell.block;
        solveAStarPath(cells, startCell, endCell);
        drawCells(ctx, cells);
        drawPath(ctx, endCell);
        return false;
    });

    var startCell= null;
    var endCell = null;

    var cells = Array();
    for (var i = 0; i < ROWS; i++) {
        for (var j = 0; j < ROWS; j++) {
            var c = new Cell(i, j);
            cells.push(c);
        }
    }

    for (var x = 0; x < ROWS; x++) {
        for (var y = 0; y < ROWS; y++) {
            if (y > 0) {
                cells[y * ROWS + x].neighbours.push(cells[(y - 1) * ROWS + (x + 0)]);
            }
            if (y < ROWS - 1){
                cells[y * ROWS + x].neighbours.push(cells[(y + 1) * ROWS + (x + 0)]);
            }
            if (x > 0) {
                cells[y * ROWS + x].neighbours.push(cells[(y + 0) * ROWS + (x - 1)]);
            }
            if (x < ROWS - 1) {
                cells[y * ROWS + x].neighbours.push(cells[(y + 0) * ROWS + (x + 1)]);
            }
        }
    }

    cells[0].start = true;
    startCell= cells[0];
    cells[250].end = true;
    endCell = cells[250];

    solveAStarPath(cells, startCell, endCell);
    drawCells(ctx, cells);
    drawPath(ctx, endCell);

});