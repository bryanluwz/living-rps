// The images of the blobs, they are actually svg tho 
const svgElementToDataURL = (svgElement) => {
	const serializer = new XMLSerializer();
	const svgString = serializer.serializeToString(new DOMParser().parseFromString(svgElement, "image/svg+xml"));
	const base64String = btoa(svgString);
	const dataURL = `data:image/svg+xml;base64,${base64String}`;
	return dataURL;
};

const SCISSORS_FILL = "#ff0000";
const PAPER_FILL = "#0000ff";
const ROCK_FILL = "#00ff00";

export const SCISSORS_IMAGE = new Image();
SCISSORS_IMAGE.src = svgElementToDataURL(`<svg xmlns="http://www.w3.org/2000/svg" height="1em" fill="${SCISSORS_FILL}" viewBox="0 0 512 512"><path d="M256 192l-39.5-39.5c4.9-12.6 7.5-26.2 7.5-40.5C224 50.1 173.9 0 112 0S0 50.1 0 112s50.1 112 112 112c14.3 0 27.9-2.7 40.5-7.5L192 256l-39.5 39.5c-12.6-4.9-26.2-7.5-40.5-7.5C50.1 288 0 338.1 0 400s50.1 112 112 112s112-50.1 112-112c0-14.3-2.7-27.9-7.5-40.5L499.2 76.8c7.1-7.1 7.1-18.5 0-25.6c-28.3-28.3-74.1-28.3-102.4 0L256 192zm22.6 150.6L396.8 460.8c28.3 28.3 74.1 28.3 102.4 0c7.1-7.1 7.1-18.5 0-25.6L342.6 278.6l-64 64zM64 112a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm48 240a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" /></svg>`);

export const PAPER_IMAGE = new Image();
PAPER_IMAGE.src = svgElementToDataURL(`<svg xmlns="http://www.w3.org/2000/svg" height="1em" fill="${PAPER_FILL}" viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H288V368c0-26.5 21.5-48 48-48H448V96c0-35.3-28.7-64-64-64H64zM448 352H402.7 336c-8.8 0-16 7.2-16 16v66.7V480l32-32 64-64 32-32z" /></svg>`);

export const ROCK_IMAGE = new Image();
ROCK_IMAGE.src = svgElementToDataURL(`<svg xmlns="http://www.w3.org/2000/svg" height="1em" fill="${ROCK_FILL}" viewBox="0 0 448 512"><path d="M144 0C117.5 0 96 21.5 96 48V96v28.5V176c0 8.8-7.2 16-16 16s-16-7.2-16-16V149.3l-9 7.5C40.4 169 32 187 32 206V244c0 38 16.9 74 46.1 98.3L128 384v96c0 17.7 14.3 32 32 32H320c17.7 0 32-14.3 32-32V374.7c46.9-19 80-65 80-118.7V176 160 144c0-26.5-21.5-48-48-48c-12.4 0-23.6 4.7-32.1 12.3C350 83.5 329.3 64 304 64c-12.4 0-23.6 4.7-32.1 12.3C270 51.5 249.3 32 224 32c-12.4 0-23.6 4.7-32.1 12.3C190 19.5 169.3 0 144 0z" /></svg>`);
