import { SCISSORS_IMAGE, PAPER_IMAGE, ROCK_IMAGE } from "./ImageConstants";

export class Blob {
	constructor(canvasWidth, canvasHeight, blobSize, blobType = "none", fps = 60,) {
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.blobSize = blobSize;
		this.blobType = blobType;

		this.x = 0;
		this.y = 0;
		this.img = null;

		this.velocity = 200 / fps;
		this.escapeVelocity = 250 / fps;
		this.huntingVelocity = 200 / fps;

		this.predatorDetectionDistance = 100;
		this.preyDetectionDistance = 200;

		this.angle = 0;

		this.allBlobs = [];

		this.start();
	}

	// Update canvas size
	updateCanvasSize(canvasWidth, canvasHeight) {
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;

		// Clamp x (y) to between 0 and canvas width (height)
		this.x = Math.max(50, Math.min(this.x, this.canvasWidth - 50));
		this.y = Math.max(50, Math.min(this.y, this.canvasHeight - 50));
	}

	// Set all blobs
	setAllBlobs(allBlobs) {
		this.allBlobs = allBlobs;
	}

	// Like Unity Update method
	update() {
		// Update current type when colliding with another blob
		// To check for "collision", check if there is another blob 
		// If yes, that means collision, make sure that two blobs don't overlap each other
		// If yes and collided is of predator type the blob type should be changed to the predator type

		const predatorType = this.getPredatorType();
		this.allBlobs.forEach(blob => {
			// If collided
			const distance = Math.sqrt(Math.pow(this.x - blob.x, 2) + Math.pow(this.y - blob.y, 2));
			if (distance < this.blobSize && distance > 0) {
				// If predator
				if (blob.blobType === predatorType) {
					this.blobType = blob.blobType;
					this.img = blob.img;
				}
			}
		});

		// Update next position
		// Average of angle is towards the center of the canvas
		// If there is predator nearby, move away from predator by averaging angle away from nearby predator within predator detection distance, 
		// Else if there is prey nearby, move towards prey by averaging angle towards nearby prey within prey detection distance,
		// Else change angle randomly with a 1 / this.fps chance of changing angle

		const nearbyPredators = this.getNearbyPredators(this.predatorDetectionDistance);
		const nearbyPreys = this.getNearbyPreys(this.preyDetectionDistance);


		if (nearbyPredators.length > 0) {
			let sumAngle = 0;
			nearbyPredators.forEach(predator => {
				sumAngle += Math.atan2(this.y - predator.y, this.x - predator.x);
			});
			this.angle = sumAngle / nearbyPredators.length;

			this.x += this.escapeVelocity * Math.cos(this.angle);
			this.y += this.escapeVelocity * Math.sin(this.angle);
		}
		else if (nearbyPreys.length > 0) {
			let sumAngle = 0;
			nearbyPreys.forEach(prey => {
				sumAngle += Math.atan2(prey.y - this.y, prey.x - this.x);
			});
			this.angle = sumAngle / nearbyPreys.length;

			this.x += this.huntingVelocity * Math.cos(this.angle);
			this.y += this.huntingVelocity * Math.sin(this.angle);
		}
		else {
			if (Math.random() < 10 / this.fps) {
				this.angle = Math.random() * 2 * Math.PI;
			}

			this.x += this.velocity * Math.cos(this.angle);
			this.y += this.velocity * Math.sin(this.angle);
		}

		// If out of bounds, move back in bounds
		if (this.x < 0) {
			this.x = 0;
		}
		if (this.x > this.canvasWidth - this.blobSize) {
			this.x = this.canvasWidth - this.blobSize;
		}
		if (this.y < 0) {
			this.y = 0;
		}
		if (this.y > this.canvasHeight - this.blobSize) {
			this.y = this.canvasHeight - this.blobSize;
		}
	}

	// Like Unity Start method
	start() {
		// Init coordinates, to random position within canvas
		this.x = Math.floor(0 + Math.random() * (this.canvasWidth - this.blobSize));
		this.y = Math.floor(0 + Math.random() * (this.canvasHeight - this.blobSize));

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
			case "rock":
				return "scissors";
			default:
				return "none";
		}
	}

	getNearbyPredators(predatorDetectionDistance = 69420) {
		const nearbyPredators = [];
		this.allBlobs.forEach(blob => {
			if (blob.blobType === this.getPredatorType()) {
				const distance = Math.sqrt(Math.pow(this.x - blob.x, 2) + Math.pow(this.y - blob.y, 2));
				if (distance < predatorDetectionDistance) {
					nearbyPredators.push(blob);
				}
			}
		});
		return nearbyPredators;
	}

	getNearbyPreys(preyDetectionDistance = 69420) {
		const nearbyPreys = [];
		this.allBlobs.forEach(blob => {
			if (blob.blobType === this.getPreyType()) {
				const distance = Math.sqrt(Math.pow(this.x - blob.x, 2) + Math.pow(this.y - blob.y, 2));
				if (distance < preyDetectionDistance) {
					nearbyPreys.push(blob);
				}
			}
		});
		return nearbyPreys;
	}
}