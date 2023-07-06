import { SCISSORS_IMAGE, PAPER_IMAGE, ROCK_IMAGE } from "./BlobConstants";

export class Blob {
	constructor(canvasWidth, canvasHeight, blobSize, blobType = "none", fps = 60, audioRefCurrent = null) {
		// Constructor
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;

		this.blobSize = blobSize;
		this.blobType = blobType;

		this.fps = fps;

		// Coords
		this.x = 0; // These x and y are top left corner of the blob
		this.y = 0;

		// Image
		this.img = null;

		// Audio
		this.audioRefCurrent = audioRefCurrent;

		// Velocity
		this.velocity = (Math.sqrt(Math.pow(canvasWidth, 2) + Math.pow(canvasHeight, 2))) / (10 * fps);
		this.velocityBoost = 1;

		// Detection distance
		this.predatorDetectionDistance = blobSize * 3;
		this.preyDetectionDistance = blobSize * 5;

		// Flags
		this.canTeleport = true;
		this.isHungry = true;
		this.isSoundOn = false;

		// Angle
		this.angle = 0;

		// All blobs
		this.allBlobs = [];

		this.start();
	}

	// Update blob size and others
	updateCanvasSize(canvasWidth, canvasHeight) {
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;

		// Clamp x (y) to between 0 and canvas width (height)
		this.x = Math.max(50, Math.min(this.x, this.canvasWidth - 50));
		this.y = Math.max(50, Math.min(this.y, this.canvasHeight - 50));
	}

	updateBlobSize(blobSize) {
		this.blobSize = blobSize;
		this.predatorDetectionDistance = blobSize * 4;
		this.preyDetectionDistance = blobSize * 2;
	}

	setIsSoundOn(isSoundOn) {
		this.isSoundOn = isSoundOn;
	}

	// Set all blobs
	setAllBlobs(allBlobs) {
		this.allBlobs = allBlobs;
	}

	// Reset audio refs
	resetAudioRef(audioRefCurrent) {
		this.audioRefCurrent = audioRefCurrent;
	}

	// Reset speed
	resetVelocity() {
		this.velocity = Math.sqrt(Math.pow(this.canvasWidth, 2) + Math.pow(this.canvasHeight, 2)) / (10 * this.fps);
	}

	// Like Unity Update method
	// Most of the update code is generated by Github Copilot
	update() {
		// Update current type when colliding with another blob
		// To check for "collision", check if there is another blob 
		// If yes, that means collision, make sure that two blobs don't overlap each other
		// If yes and collided is of predator type the blob type should be changed to the predator type

		this.allBlobs.forEach(blob => {
			// If collided
			const distance = Math.sqrt(Math.pow(this.x - blob.x, 2) + Math.pow(this.y - blob.y, 2));
			if (distance < (this.blobSize * 0.8) && distance > 0) {
				// If predator
				if (blob.blobType === this.getPredatorType()) {
					this.blobType = blob.blobType;
					this.img = blob.img;
					this.audioRefCurrent = blob.audioRefCurrent;

					if (this.isSoundOn && blob.audioRefCurrent) {
						blob.audioRefCurrent.currentTime = 0;
						blob.audioRefCurrent.play();
					}

					blob.isHungry = false;
					blob.velocityBoost = 1;
					setTimeout(() => {
						blob.isHungry = true;
					}, 2000);
				}
			}
		});

		// Update next position
		// Average of angle is towards the center of the canvas
		// If there is predator nearby, move away from predator by averaging angle away from nearby predator within predator detection distance, 
		// Else if there is prey nearby, move towards prey by averaging angle towards nearby prey within prey detection distance,
		// Else tilt angle slightly towards center of canvas

		const nearbyPredators = this.getNearbyPredators(this.predatorDetectionDistance);
		const nearbyPreys = this.getNearbyPreys(this.preyDetectionDistance);

		// Run away from predators
		if (nearbyPredators.length > 0) {
			let sumAngle = 0;
			nearbyPredators.forEach(predator => {
				sumAngle += Math.atan2(this.y - predator.y, this.x - predator.x);
			});

			this.angle = sumAngle / nearbyPredators.length;
		}

		// Run towards nearest prey
		else if (nearbyPreys.length > 0) {
			const prey = nearbyPreys[0];
			this.angle = Math.atan2(prey.y - this.y, prey.x - this.x);

			if (this.isHungry) {
				this.velocityBoost += 0.05;
				this.velocityBoost = Math.min(this.velocityBoost, 1.25);
			}
		}

		else {
			if (Math.random() < (2 / this.fps)) {
				this.angle = Math.random() * 2 * Math.PI;
			}
		}

		// If no prey at all, slow down
		if (nearbyPreys.length === 0) {
			this.velocityBoost = 1;
		}

		this.x += this.velocity * Math.cos(this.angle) * this.velocityBoost;
		this.y += this.velocity * Math.sin(this.angle) * this.velocityBoost;

		// If out of bounds, move back in bounds by teleporting it to the other side of the canvas (cause otherwise they be stucking there)
		if (this.x < 0) {
			if (this.canTeleport) {
				this.x = this.canvasWidth - this.blobSize;
				this.canTeleport = false;
			}
			else {
				this.x = 0;
			}
		}
		else if (this.x > this.canvasWidth - this.blobSize) {
			if (this.canTeleport) {
				this.canTeleport = false;
				this.x = 0;
			}
			else {
				this.x = this.canvasWidth - this.blobSize;
			}
		}

		if (this.y < 0) {
			if (this.canTeleport) {
				this.y = this.canvasHeight - this.blobSize;
				this.canTeleport = false;
			}
			else {
				this.y = 0;
			}
		}
		else if (this.y > this.canvasHeight - this.blobSize) {
			if (this.canTeleport) {
				this.y = 0;
				this.canTeleport = false;
			}
			else {
				this.y = this.canvasHeight - this.blobSize;
			}
		}

		if (!this.canTeleport) {
			setTimeout(() => {
				this.canTeleport = true;
			}, 2000);
		}
	}

	// Like Unity Start method
	start() {
		// Init coordinates, to random position within canvas
		this.x = Math.floor(0 + Math.random() * (this.canvasWidth - this.blobSize));
		this.y = Math.floor(0 + Math.random() * (this.canvasHeight - this.blobSize));
		this.angle = Math.random() * 2 * Math.PI;

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
				this.audioRefCurrent = null;
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