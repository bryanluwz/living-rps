import { Component, createRef } from "react";
import { ContentDisplay } from "../components/others/";
import { Blob } from "./Blob";

export default class Main extends Component {
	constructor(props) {
		super(props);
		this.canvasRef = createRef();

		this.blobs = [];

		this.state = {
			scissorsBlobCount: 10,
			paperBlobCount: 10,
			rockBlobCount: 10,
			blobSize: 50,
			isEnd: false,
		};

		this.fps = 400;
		this.canvasUpdateTimerTick = 0;
		this.canvasUpdateTimer = setInterval(() => {
			if (!this.state.isEnd) {
				this.canvasUpdateTimerTick++;
				this.canvasUpdate();
			}
		}, 1000 / this.fps);
	}

	componentDidMount() {
		this.handleResize();

		window.addEventListener('resize', this.handleResize);

		// Init game
		this.initBlobs();
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	// Handle screen resize
	handleResize = () => {
		const canvas = this.canvasRef.current;
		if (!canvas) return;

		canvas.width = window.innerWidth * 0.9;
		canvas.height = window.innerHeight * 0.8;

		this.setState({ blobSize: Math.min(50, canvas.width * 0.05) });

		// Rerender code here
		this.blobs.forEach(blob => {
			blob.updateCanvasSize(canvas.width, canvas.height);
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
			if (this.blobs.every(b => b.blobType === blob.blobType)) {
				this.setState({ isEnd: true });
			}
		});
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
			this.blobs.push(new Blob(canvas.width, canvas.height, this.state.blobSize, "scissors", this.fps));
		}

		for (let i = 0; i < this.state.paperBlobCount; i++) {
			this.blobs.push(new Blob(canvas.width, canvas.height, this.state.blobSize, "paper", this.fps));
		}

		for (let i = 0; i < this.state.rockBlobCount; i++) {
			this.blobs.push(new Blob(canvas.width, canvas.height, this.state.blobSize, "rock", this.fps));
		}

		// Each blob would also have a reference to the other blobs
		this.blobs.forEach(blob => {
			blob.setAllBlobs(this.blobs);
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
				backButtonRoute={"https://bryanluwz.github.io/"}
				displayName={Main.displayName}
				displayClearHistory={true}
				faIcon={"fa-refresh"}
				contentBodyAdditionalClasses={[]}
				router={this.props.router}
				handleHeaderTitleClick={() => { console.log("please do not click the title"); }}
				handleDeleteHistoryButton={() => { this.resetBlobs(); }}
			>
				<canvas ref={this.canvasRef} className="living-rps-canvas" />
			</ContentDisplay>
		);
	}
}

Main.displayName = "Living RPS";
