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

function drawCells(ctx, cells) {
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
            ctx.strokeStyle = "red";
            ctx.stroke();
        }
    }
    for (var i = 0; i < cells.length; i++) { 
        var cell = cells[i];
        var x = cell.x * CELL_WIDTH;
        var y = cell.y * CELL_HEIGHT;
        x = x + BORDER;
        y = y + BORDER;
        ctx.fillStyle = "red";
        ctx.fillRect(x, y, CELL_WIDTH - (2 * BORDER), CELL_HEIGHT - (2 * BORDER));
    }
}

document.addEventListener("DOMContentLoaded", function() {
	var canvas = document.getElementById("field");
    var ctx = canvas.getContext('2d');
    console.log("load");

    var cells = Array();
    for (var i = 0; i < ROWS; i++) {
        for (var j = 0; j < ROWS; j++) {
            console.log(i, j);
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

    drawCells(ctx, cells);

});