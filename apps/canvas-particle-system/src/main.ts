import { Effect } from "./particle";
import "./style.css";

window.addEventListener("load", () => {
	const image = document.createElement("img");
	image.src = "./image.png";

	image.addEventListener("load", () => main(image));
});

function main(img: HTMLImageElement) {
	const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
	if (!canvas) throw new Error("Canvas element not found!");

	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Couldn't to aquire canvas drawing context!");

	const width = window.innerWidth;
	const height = window.innerHeight;

	canvas.width = width;
	canvas.height = height;

	const effect = new Effect(ctx, width, height);
	effect.init(img);
	effect.draw();

	function animate() {
		effect.draw();

		window.requestAnimationFrame(animate);
	}

	let animated = false;

	const button = document.querySelector("#button");
	if (button) {
		button.addEventListener("click", () => {
			if (animated) return;
			animated = true;
			animate();
		});
	}
}
