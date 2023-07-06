import { Component, Fragment, createRef } from "react";
import { ContentDisplay } from "../components/others/";
import { Blob } from "./Blob";

const rootStyles = getComputedStyle(document.documentElement);
const victoryColor = rootStyles.getPropertyValue('--lavender-pastel-font-1');

export default class Main extends Component {
	constructor(props) {
		super(props);
		this.canvasRef = createRef();

		this.blobs = [];

		this.state = {
			scissorsBlobCount: 12,
			paperBlobCount: 12,
			rockBlobCount: 12,
			blobSize: 50,
			isEnd: false,
			isSoundOn: false,
			isSoundInit: false,
			victoryType: "none",
		};

		this.fps = 60;
		this.canvasUpdateTimerTick = 0;
		this.canvasUpdateTimer = setInterval(() => {
			this.canvasUpdateTimerTick++;
			this.canvasUpdate();
		}, 1000 / this.fps);

		this.audioRefs = {
			scissors: createRef(),
			paper: createRef(),
			rock: createRef(),
			victory: createRef(),
		};
	}

	componentDidMount() {
		window.addEventListener('resize', this.handleResize);

		// Init game
		this.setState(this.handleResize, this.initBlobs);

		// What?? A warning?? I don't care
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	// Handle screen resize
	handleResize = () => {
		const canvas = this.canvasRef.current;
		if (!canvas) return;

		canvas.width = window.innerWidth * 1;
		canvas.height = window.innerHeight * 1;

		const blobSize = Math.max(25, Math.min(50, canvas.width * 0.05));

		this.setState({ blobSize });

		// Rerender code here
		this.blobs.forEach(blob => {
			blob.updateCanvasSize(canvas.width, canvas.height);
			blob.updateBlobSize(blobSize);
			blob.resetVelocity();
		}
		);
	};

	// Code to update the canvas
	canvasUpdate = () => {
		const canvas = this.canvasRef.current;
		if (!canvas) return;

		const context = canvas.getContext('2d');

		context.clearRect(0, 0, canvas.width, canvas.height);

		this.renderBlobs();
		this.updateBlobs();

		// Check if game is over
		this.blobs.forEach(blob => {
			// If all blobs are of the same type
			if (!this.state.isEnd && this.blobs.every(b => b.blobType === blob.blobType)) {
				this.setState({ isEnd: true, victoryType: this.blobs[0].blobType },
					() => {
						if (this.state.isSoundOn) {
							setTimeout(() => {
								this.audioRefs.victory.current.play();
							}, 300);
						}
					});
			}
		});

		// When game over
		this.renderVictoryScene();
	};

	// Reset blobs
	resetBlobs = () => {
		this.initBlobs();
	};

	// Init blobs
	initBlobs = () => {
		const canvas = this.canvasRef.current;
		if (!canvas) return;

		this.blobs = [];

		for (let i = 0; i < this.state.scissorsBlobCount; i++) {
			this.blobs.push(new Blob(canvas.width, canvas.height, this.state.blobSize, "scissors", this.fps, this.audioRefs.scissors.current));
		}

		for (let i = 0; i < this.state.paperBlobCount; i++) {
			this.blobs.push(new Blob(canvas.width, canvas.height, this.state.blobSize, "paper", this.fps, this.audioRefs.paper.current));
		}

		for (let i = 0; i < this.state.rockBlobCount; i++) {
			this.blobs.push(new Blob(canvas.width, canvas.height, this.state.blobSize, "rock", this.fps, this.audioRefs.rock.current));
		}

		// Each blob would also have a reference to the other blobs
		this.blobs.forEach(blob => {
			blob.setAllBlobs(this.blobs);
			blob.setIsSoundOn(this.state.isSoundOn);
		}
		);
	};

	// Render blobs
	renderBlobs = () => {
		const canvas = this.canvasRef.current;
		if (!canvas) return;

		const context = canvas.getContext('2d');

		this.blobs.forEach(blob => {
			if (blob.img) {
				context.drawImage(blob.img, blob.x, blob.y, this.state.blobSize, this.state.blobSize);
			}
		});
	};

	// Update blobs
	updateBlobs = () => {
		this.blobs.forEach(blob => {
			blob.update();
		});
	};

	// Render victory scene
	renderVictoryScene = () => {
		const canvas = this.canvasRef.current;
		if (!canvas) return;

		const context = canvas.getContext('2d');

		if (this.state.isEnd) {
			context.fillStyle = victoryColor;
			context.font = "bold 3em Poppins";
			context.textAlign = "center";
			context.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 30);

			context.font = "bold 1.5em Poppins";
			context.fillText(`${this.state.victoryType.toUpperCase()} wins`, canvas.width / 2, canvas.height / 2 + 10);
		}
	};

	render() {
		return (
			<ContentDisplay
				backButtonRedirect={"https://bryanluwz.github.io/#/fun-stuff"}
				displayName={Main.displayName}
				displayClearHistory={true}
				faIcon={"fa-refresh"}
				contentBodyAdditionalClasses={["living-rps-content-body"]}
				overrideTitle={
					<div style={{ display: "flex", alignItems: "center" }}>
						<div style={{ width: "20px" }}>
						</div>
						<div style={{ flexGrow: "1" }} >Living RPS </div>
						<div style={{ width: "20px" }}
							onClick={() => {
								if (!this.state.isSoundInit) {
									this.setState({ isSoundInit: true });
								}
								const isSoundOn = !this.state.isSoundOn;
								this.setState({ isSoundOn: isSoundOn, isSoundInit: true },
									() => {
										this.blobs.forEach(blob => {
											blob.setIsSoundOn(isSoundOn);
											switch (blob.blobType) {
												case "scissors":
													blob.resetAudioRef(this.audioRefs.scissors.current);
													break;
												case "paper":
													blob.resetAudioRef(this.audioRefs.paper.current);
													break;
												case "rock":
													blob.resetAudioRef(this.audioRefs.rock.current);
													break;
												default:
													break;
											}
										});
									});
							}}>
							{this.state.isSoundOn ?
								< i className="fa fa-volume-up" aria-hidden="true" style={{ cursor: "pointer" }} /> :
								< i className="fa fa-volume-off" aria-hidden="true" style={{ cursor: "pointer" }} />}
						</div>
					</div>
				}
				router={this.props.router}
				handleHeaderTitleClick={() => {
					console.log("Do not the title");
				}}
				handleDeleteHistoryButton={() => { this.resetBlobs(); }}
			>
				{
					this.state.isSoundInit &&
					<Fragment>
						<audio
							ref={this.audioRefs.scissors}
							src={process.env.PUBLIC_URL + "/other-assets/Living-RPS-sound-effects/scissors.mp3"}
						/>

						<audio
							ref={this.audioRefs.paper}
							src={process.env.PUBLIC_URL + "/other-assets/Living-RPS-sound-effects/paper.mp3"}
						/>

						<audio
							ref={this.audioRefs.rock}
							src={process.env.PUBLIC_URL + "/other-assets/Living-RPS-sound-effects/rock.mp3"}
						/>

						<audio
							ref={this.audioRefs.victory}
							src={process.env.PUBLIC_URL + "/other-assets/Living-RPS-sound-effects/tada.mp3"}
						/>
					</Fragment>
				}

				<canvas ref={this.canvasRef} className="living-rps-canvas" />
			</ContentDisplay>
		);
	}
}

Main.displayName = "Living RPS";
