
// ✖

let unit;

let numbers = [[14, 7, 7]];

let triPos;
let scale;

let textBoxes = [];
let boxMouseOver = -1;
let focusedBox = -1;
let prevActiveElement;

let info;
let explained = false;

let prevKeyPress = -1;
let looping = true;

function setup() {
	createCanvas(windowWidth, windowHeight);

	triPos = [
		[
			{ x: 0, y: -1 },
			{ x: sqrt(3) / 2, y: 0.5 },
			{ x: -sqrt(3) / 2, y: 0.5 }
		],
		[
			{ x: 0, y: 1 },
			{ x: -sqrt(3) / 2, y: -0.5 },
			{ x: sqrt(3) / 2, y: -0.5 }
		]

	];

	unit = min(width, height) / 100;
	scale = unit * 10;

	for (let box = 0; box < 3; box++) {
		textBoxes.push(createInput("", "number"));
		textBoxes[box].value(numbers[0][box]);
		textBoxes[box].mouseOver(function () {
			boxMouseOver = box;
			//this.style("background-color", color(0x30));
			this.style("border-color", "red");
		});
		textBoxes[box].mouseOut(function () {
			boxMouseOver = -1;
			//this.style("background-color", "black");
			this.style("border-color", "white");
		});
		textBoxes[box].id("Box-" + box);
	}

	info = createButton("?");
	info.id("info");
	info.showInfo = false;
	info.mouseOver(function () {
		this.style("background-color", "white");
		this.style("color", "black");
	});
	info.mouseOut(function () {
		this.style("background-color", "black");
		this.style("color", "white");
	});
	info.mousePressed(function () {
		explained = true;
		this.showInfo = !this.showInfo;
		(this.showInfo) ? this.html("X") : this.html("?");

		/*
		for (let i = 0; i < textBoxes.length; i++) {
			(this.showInfo) ? textBoxes[i].hide() : textBoxes[i].show();
		}
		*/


	});

	windowResized();

	prevActiveElement = document.activeElement;
}

function draw() {
	background("black");

	if (document.activeElement != prevActiveElement) {
		focusedBox = -1;
		for (let i in [...Array(3)]) {
			if (document.getElementById("Box-" + i) == document.activeElement) {
				focusedBox = i;
				textBoxes[i].style("background-color", "#333");
			} else {
				textBoxes[i].style("background-color", "#000");
			}
		}

		if (focusedBox >= 0) {
		}
	}

	let calculate = false;
	if (keyIsPressed) {
		if (prevKeyPress == -1) {
			calculate = true;
			prevKeyPress = millis() + 300;
		} else if (millis() - prevKeyPress > 50) {
			calculate = true;
			prevKeyPress = millis();
		}
		if (calculate) {
			if (keyIsDown(unchar("A")) || keyIsDown(RIGHT_ARROW)) {
				let triangles = numbers.length;
				numbers.push([0, 0, 0]);
			} else if (keyIsDown(unchar("D")) || keyIsDown(LEFT_ARROW)) {
				if (numbers.length > 1) {
					numbers.pop();
				}
			}
			if (keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW)) {
				if (boxMouseOver >= 0 && focusedBox == -1) {
					if (document.getElementById("Box-" + boxMouseOver) != document.activeElement) {
						if (keyIsDown(UP_ARROW)) {
							textBoxes[boxMouseOver].value(Number(textBoxes[boxMouseOver].value()) + 1);
						} else {
							textBoxes[boxMouseOver].value(Number(textBoxes[boxMouseOver].value()) - 1);
						}
					}
				} else if (focusedBox == -1) {
					if (keyIsDown(UP_ARROW)) {
						scale *= 1.3;
					} else {
						scale /= 1.3;
					}
				}
			}


		}
	} else {
		prevKeyPress = -1;
	}


	for (let i = 0; i < 3; i++) {
		numbers[0][i] = Number(textBoxes[i].value());
	}
	for (let i = 1; i < numbers.length; i++) {
		numbers[i][0] = abs(numbers[i - 1][1] - numbers[i - 1][2]);
		numbers[i][1] = abs(numbers[i - 1][2] - numbers[i - 1][0]);
		numbers[i][2] = abs(numbers[i - 1][0] - numbers[i - 1][1]);
	}



	push();
	translate(width / 2, height / 2);
	for (let tri = 0; tri < numbers.length; tri++) {
		let triangleSize = scale * pow(2, tri);
		let orientation = tri % 2;

		stroke("white");
		noFill();
		strokeWeight(triangleSize / 60 + 1);
		strokeJoin(ROUND);
		triangle(
			triPos[orientation][0].x * triangleSize, triPos[orientation][0].y * triangleSize,
			triPos[orientation][1].x * triangleSize, triPos[orientation][1].y * triangleSize,
			triPos[orientation][2].x * triangleSize, triPos[orientation][2].y * triangleSize
		);

	}
	for (let tri = 0; tri < numbers.length; tri++) {
		let triangleSize = scale * pow(2, tri) * 1.3;
		let orientation = tri % 2;
		stroke("black");
		strokeWeight(triangleSize / 40);
		textAlign(CENTER, CENTER);
		textSize(triangleSize / 3);
		for (let i = 0; i < 3; i++) {
			if (tri == 0 && i == boxMouseOver) {
				fill("red"); stroke("white"); textStyle(BOLD);
			} else {
				fill("white"); stroke("black"); textStyle(NORMAL);
			}
			text(numbers[tri][i], triPos[orientation][i].x * triangleSize, triPos[orientation][i].y * triangleSize);
		}
	}
	pop();

	fill("white");
	stroke("black");
	strokeWeight(unit * 1);
	textSize(unit * 3);

	textAlign(RIGHT, BOTTOM);
	let tris = numbers.length;
	text(`${(looping) ? "" : "rendering paused (Esc to re-enable) • "}Triangles: ${tris} • Sum of numbers of last triangle: ${numbers[tris - 1][0] + numbers[tris - 1][1] + numbers[tris - 1][2]}`, width - unit, height - unit);

	if (!explained) {
		textAlign(RIGHT, CENTER);
		text("Click here to get the controls and more explained! →", width - info.width - unit * 3 + cos(millis() / 110) * unit * 0.5, info.height / 2 + unit * 1.2);
	}

	if (info.showInfo) {
		fill(0, 220);
		noStroke();
		rect(0, 0, width, height);

		fill("white");
		stroke("black");
		strokeWeight(unit / 2);
		textSize(width / 80);
		textAlign(LEFT, BOTTOM);

		/*
		for (let i = 0; i < textBoxes.length; i++) {
			textBoxes[i].style("background-color", color(30));
		}
		*/

		text("This program was made for Matt Parker's Maths Puzzle #9: take-away triangles.\n\n" +
			"Controls:\n" +
			"Add or delete a triangle:\n" +
			"\t - Press A / D.\n" +
			"\t - Use right / left arrow keys.\n" +
			"Zoom in and out:\n" +
			"\t - Scroll with mousewheel.\n" +
			"\t - Scroll with two fingers on a touchpad.\n" +
			"\t - Use up / down arrow keys.\n" +
			"Edit starting numbers:\n" +
			"\t - Click into a number box and enter a number\n" +
			"\t - Hover over a number box and scroll with the mousewheel to increase / decrease.\n" +
			"\t - Hover over a number box and scroll with two fingers on a touchpad to increase / decrease.\n" +
			"\t - Hover over a number box and use up / down arrow keys to increase / decrease.\n" +
			"\t - Click on the little arrows next to a number box to increase / decrease.\n" +
			"\t - Click into a number box and use up / down arrow keys to increase / decrease.\n\n",
			width / 6, height);

		textAlign(LEFT, TOP);
		if (boxMouseOver >= 0) {
			text("← And now scroll with the mousewheel or use the arrow keys to increase or decrease the number.\n\t\t You can also click in the box to enter a number.",
				textBoxes[boxMouseOver].width + unit * 2,
				textBoxes[boxMouseOver].position().y + textBoxes[boxMouseOver].height / 4);
		} else {
			text("← Hover your mouse over one of the number boxes.",
				textBoxes[0].width + unit * 2,
				textBoxes[0].height * 1.6 + sin(millis() / 400) * textBoxes[0].height * 1.1);
		}

	}

	textSize(unit * 2);
	textAlign(LEFT, BOTTOM);
	text("© 2020 Benjamin Aster", unit, height - unit);


	prevActiveElement = document.activeElement;
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);

	unit = min(width, height) / 100;

	for (let box in Array(3).fill(0)) {
		textBoxes[box].size(unit * 10, unit * 5);
		textBoxes[box].position(unit, box * unit * 6.5 + unit);
		textBoxes[box].style("font-size", str(unit * 3) + "px");
		textBoxes[box].style("border-radius", str(unit * 1.2) + "px");
	}

	info.size(unit * 5, unit * 5);
	info.position(width - info.width - unit, unit);
	info.style("font-size", str(unit * 3) + "px");

}

function keyReleased() {
	if (keyCode == ESCAPE) {
		looping = !looping;
		(looping) ? loop() : noLoop();
	}
}

function mouseWheel(event) {
	if (boxMouseOver >= 0) {
		if (document.getElementById("Box-" + boxMouseOver) != document.activeElement) {
			if (event.delta > 0) {
				textBoxes[boxMouseOver].value(Number(textBoxes[boxMouseOver].value()) - 1);
			} else {
				textBoxes[boxMouseOver].value(Number(textBoxes[boxMouseOver].value()) + 1);
			}
		}
	}
	else {
		if (event.delta > 0) {
			scale /= 1.3;
		} else {
			scale *= 1.3;
		}
	}
}












