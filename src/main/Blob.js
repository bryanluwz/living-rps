import { SCISSORS_IMAGE, PAPER_IMAGE, ROCK_IMAGE } from "./ImageConstants";

export class Blob {
	constructor(canvasWidth, canvasHeight, blobType = "none", fps = 60) {
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.blobType = blobType;

		this.x = 0;
		this.y = 0;
		this.img = null;
		this.velocity = 200 / fps;

		this.allBlobs = [];

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

	// Set all blobs
	setAllBlobs(allBlobs) {
		this.allBlobs = allBlobs;
	}

	// Like Unity Update method
	update() {
		// Update current type when colliding with another blob
		// To check for "collision", check if there is another blob of a predator type within 50px
		// If yes, that means collision, and the blob type should be changed to the predator type
		const predatorType = this.getPredatorType();
		this.allBlobs.forEach(blob => {
			if (blob.blobType === predatorType) {
				const distance = Math.sqrt(Math.pow(this.x - blob.x, 2) + Math.pow(this.y - blob.y, 2));
				if (distance < 50) {
					this.blobType = blob.blobType;
					this.img = blob.img;
				}
			}
		});

		// Update next position
		// If there is predator nearby, move away from predator,
		// Else if there is prey nearby, move towards prey,
		// Else move randomly within 50px
		const predatorNearby = this.allBlobs.some(blob => blob.blobType === predatorType &&
			Math.sqrt(Math.pow(this.x - blob.x, 2) + Math.pow(this.y - blob.y, 2)) < Math.sqrt(Math.pow(this.canvasWidth, 2) + Math.pow(this.canvasHeight, 2)));

		const preyNearby = this.allBlobs.some(blob => blob.blobType === this.blobType &&
			Math.sqrt(Math.pow(this.x - blob.x, 2) + Math.pow(this.y - blob.y, 2)) < Math.sqrt(Math.pow(this.canvasWidth, 2) + Math.pow(this.canvasHeight, 2)));

		if (predatorNearby) {
			// Move away from predator
			const predator = this.allBlobs.find(blob => blob.blobType === predatorType);
			const angle = Math.atan2(this.y - predator.y, this.x - predator.x);
			this.x += this.velocity * Math.cos(angle);
			this.y += this.velocity * Math.sin(angle);
		}

		if (preyNearby) {
			// Move towards prey
			const prey = this.allBlobs.find(blob => blob.blobType === this.blobType);
			const angle = Math.atan2(prey.y - this.y, prey.x - this.x);
			this.x += this.velocity * Math.cos(angle);
			this.y += this.velocity * Math.sin(angle);
		}

		if (!predatorNearby && !preyNearby) {
			// Move randomly
			const angle = Math.random() * 2 * Math.PI;
			this.x += this.velocity * Math.cos(angle);
			this.y += this.velocity * Math.sin(angle);
		}

		// If out of bounds, move back in bounds
		if (this.x < 0) {
			this.x = 0;
		}
		if (this.x > this.canvasWidth - 50) {
			this.x = this.canvasWidth - 50;
		}
		if (this.y < 0) {
			this.y = 0;
		}
		if (this.y > this.canvasHeight - 50) {
			this.y = this.canvasHeight - 50;
		}
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

	// Util functions
	getPredatorType() {
		switch (this.blobType) {
			case "scissors":
				return "rock";
			case "paper":
				return "scissors";
			case "rock":
				return "paper";
			default:
				return "none";
		}
	}

	getPreyType() {
		switch (this.blobType) {
			case "scissors":
				return "paper";
			case "paper":
				return "rock";
			case "paper":
				return "scissors";
			default:
				return "none";
		}
	}
}