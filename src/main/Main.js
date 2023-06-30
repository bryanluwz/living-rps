import { Component, createRef } from "react";
import { ContentDisplay } from "../components/others/";
import { Blob } from "./Blob";

export default class Main extends Component {
	constructor(props) {
		super(props);
		this.canvasRef = createRef();

		this.blobs = [];

		this.state = {
			scissorsBlobCount: 20,
			paperBlobCount: 20,
			rockBlobCount: 20,
		};

		this.fps = 60;
		this.canvasUpdateTimerTick = 0;
		this.canvasUpdateTimer = setInterval(() => {
			this.canvasUpdateTimerTick++;
			this.canvasUpdate();
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

		canvas.width = window.innerWidth * 0.9;
		canvas.height = window.innerHeight * 0.8;

		// Rerender code here
		this.blobs.forEach(blob => {
			blob.updateCanvasSize(canvas.width, canvas.height);
		}
		);
	};

	// Code to update the canvas
	canvasUpdate = () => {
		const canvas = this.canvasRef.current;
		const context = canvas.getContext('2d');

		context.clearRect(0, 0, canvas.width, canvas.height);

		this.renderBlobs();
		this.updateBlobs();
	};

	// Reset blobs
	resetBlobs = () => {
		this.initBlobs();
	};

	// Init blobs
	initBlobs = () => {
		const canvas = this.canvasRef.current;
		this.blobs = [];

		for (let i = 0; i < this.state.scissorsBlobCount; i++) {
			this.blobs.push(new Blob(canvas.width, canvas.height, "scissors", this.fps));
		}

		for (let i = 0; i < this.state.paperBlobCount; i++) {
			this.blobs.push(new Blob(canvas.width, canvas.height, "paper", this.fps));
		}

		for (let i = 0; i < this.state.rockBlobCount; i++) {
			this.blobs.push(new Blob(canvas.width, canvas.height, "rock", this.fps));
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
		const context = canvas.getContext('2d');

		this.blobs.forEach(blob => {
			if (blob.img) {
				context.drawImage(blob.img, blob.x, blob.y, 50, 50);
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
