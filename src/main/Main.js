import { Component, createRef } from "react";
import { ContentDisplay } from "../components/others/";
import { Blob } from "./Blob";

export default class Main extends Component {
	constructor(props) {
		super(props);
		this.canvasRef = createRef();

		this.blobs = [];

		this.state = {
			startingBlobCount: 90,
			scissorsBlobCount: 30,
			paperBlobCount: 30,
			rockBlobCount: 30,
		};

		this.canvasUpdateTimerTick = 0;
		this.canvasUpdateTimer = setInterval(() => {
			this.canvasUpdateTimerTick++;
			this.canvasUpdate();
		}, 1000 / 60);
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

	// Init blobs
	initBlobs = () => {
		const canvas = this.canvasRef.current;

		for (let i = 0; i < this.state.scissorsBlobCount; i++) {
			this.blobs.push(new Blob(canvas.width, canvas.height, "scissors"));
		}

		for (let i = 0; i < this.state.paperBlobCount; i++) {
			this.blobs.push(new Blob(canvas.width, canvas.height, "paper"));
		}

		for (let i = 0; i < this.state.rockBlobCount; i++) {
			this.blobs.push(new Blob(canvas.width, canvas.height, "rock"));
		}
	};

	// Render blobs
	renderBlobs = () => {
		const canvas = this.canvasRef.current;
		const context = canvas.getContext('2d');

		this.blobs.forEach(blob => {
			if (blob.img) {
				context.drawImage(blob.img, blob.x, blob.y, 100, 100);
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
				handleDeleteHistoryButton={() => { console.log("please do not the button"); }}
			>
				<canvas ref={this.canvasRef} style={{ border: "1px solid red" }} />
			</ContentDisplay>
		);
	}
}

Main.displayName = "Living RPS";
