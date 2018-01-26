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

});