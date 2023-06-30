import { SCISSORS_IMAGE, PAPER_IMAGE, ROCK_IMAGE } from "./ImageConstants";

export class Blob {
	constructor(canvasWidth, canvasHeight, blobType = "none") {
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.blobType = blobType;

		this.x = 0;
		this.y = 0;
		this.img = null;
		this.velocity = 10;

		this.start();
	}

	// Update canvas size
	updateCanvasSize(canvasWidth, canvasHeight) {
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;

		// Clamp x (y) to between 0 and canvas width (height)
		this.x = Math.max(0, Math.min(this.x, this.canvasWidth));
		this.y = Math.max(0, Math.min(this.y, this.canvasHeight));
	}

	// Get next move position

	// Like Unity Update method
	update() {
		// Update next position
		this.x += this.velocity - this.velocity / 2;
		this.y += Math.random() * this.velocity - this.velocity / 2;

		this.x = Math.max(50, Math.min(this.x, this.canvasWidth - 50));
		this.y = Math.max(50, Math.min(this.y, this.canvasHeight - 50));
	}

	// Like Unity Start method
	start() {
		// Init coordinates, to random, and 50px margin from edge
		this.x = Math.floor(50 + Math.random() * (this.canvasWidth - 50));
		this.y = Math.floor(50 + Math.random() * (this.canvasHeight - 50));

		// Init image
		switch (this.blobType) {
			case "scissors":
				this.img = SCISSORS_IMAGE;
				break;
			case "paper":
				this.img = PAPER_IMAGE;
				break;
			case "rock":
				this.img = ROCK_IMAGE;
				break;
			default:
				this.img = null;
				break;
		}
	}
}