import { Component, Fragment, createRef } from "react";
import { ContentDisplay } from "../components/others/";
import { Blob } from "./Blob";

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
			isSoundInit: false
		};

		this.fps = 60;
		this.canvasUpdateTimerTick = 0;
		this.canvasUpdateTimer = setInterval(() => {
			if (!this.state.isEnd) {
				this.canvasUpdateTimerTick++;
				this.canvasUpdate();
			}
		}, 1000 / this.fps);

		this.audioRefs = {
			scissors: createRef(),
			paper: createRef(),
			rock: createRef(),
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

		// Check if game is over, (temp disabled)
		// this.blobs.forEach(blob => {
		// 	// If all blobs are of the same type
		// 	if (this.blobs.every(b => b.blobType === blob.blobType)) {
		// 		this.setState({ isEnd: true });
		// 	}
		// });
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
			console.log(this.blobs[i]);
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

	render() {
		return (
			<ContentDisplay
				backButtonRedirect={"https://bryanluwz.github.io/#/fun-stuff"}
				displayName={Main.displayName}
				displayClearHistory={true}
				faIcon={"fa-refresh"}
				contentBodyAdditionalClasses={["living-rps-content-body"]}
				overrideTitle={
					<Fragment>
						<span>Living RPS </span>
						{this.state.isSoundOn ?
							< i className="fa fa-volume-up" aria-hidden="true" /> :
							< i className="fa fa-volume-off" aria-hidden="true" />}
					</Fragment>
				}
				router={this.props.router}
				handleHeaderTitleClick={() => {
					// Play all sounds if sound is not initialized because chrome wont let me play sound without user interaction
					if (!this.state.isSoundInit) {
						this.audioRefs.scissors.current.play();
						this.audioRefs.paper.current.play();
						this.audioRefs.rock.current.play();
					}
					const isSoundOn = !this.state.isSoundOn;
					this.setState({ isSoundOn: isSoundOn, isSoundInit: true },
						() => {
							this.blobs.forEach(blob => {
								blob.setIsSoundOn(isSoundOn);
							});
						});
				}}
				handleDeleteHistoryButton={() => { this.resetBlobs(); }}
			>
				<audio ref={this.audioRefs.scissors} src={process.env.PUBLIC_URL + "/other-assets/Living-RPS-sound-effects/scissors.mp3"} />
				<audio ref={this.audioRefs.paper} src={process.env.PUBLIC_URL + "/other-assets/Living-RPS-sound-effects/paper.mp3"} />
				<audio ref={this.audioRefs.rock} src={process.env.PUBLIC_URL + "/other-assets/Living-RPS-sound-effects/rock.mp3"} />
				<canvas ref={this.canvasRef} className="living-rps-canvas" />
			</ContentDisplay>
		);
	}
}

Main.displayName = "Living RPS";
