export class Particle {
	effect: Effect;
	ctx: CanvasRenderingContext2D;
	pos: Vector2D;
	currPos: Vector2D;
	color: string;
	size: number;

	vx = 5;
	vy = 5;

	constructor(
		effect: Effect,
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		color: string,
		size: number,
	) {
		this.effect = effect;
		this.ctx = ctx;
		this.color = color;
		this.size = size;
		this.pos = [Math.floor(x), Math.floor(y)];

		// this.currPos = [0, this.pos[1]];

		// this.currPos = [this.pos[0], 0];

		// this.currPos = [
		// 	Math.floor(Math.random() * effect.width),
		// 	Math.floor(Math.random() * effect.height),
		// ];

		this.currPos = [...effect.center];
	}

	draw() {
		this.ctx.fillStyle = this.color;
		this.ctx.fillRect(this.currPos[0], this.currPos[1], this.size, this.size);
	}

	update() {
		const distFromMouse =
			this.currPos[0] -
			this.effect.mouse.x +
			(this.currPos[1] - this.effect.mouse.y);

		const changeX = this.getPosChange(this.currPos[0], this.pos[0], this.vx);
		if (changeX) this.currPos[0] += changeX;

		const changeY = this.getPosChange(this.currPos[1], this.pos[1], this.vy);
		if (changeY) this.currPos[1] += changeY;
	}

	getPosChange(currPos: number, originalPos: number, velocity: number) {
		const difference = currPos - originalPos;

		if (difference === 0) return 0;
		else if (difference > 0) {
			if (velocity > difference - 1) return -1;
			return -velocity;
		} else if (difference < 0) {
			if (velocity > -difference - 1) return 1;
			return velocity;
		}
	}
}

export class Effect {
	ctx: CanvasRenderingContext2D;
	width: number;
	height: number;
	particles: Particle[];
	resolutionPx = 3;

	center: Vector2D;
	offset: Vector2D;
	offsetDimensions: Vector2D;

	mouse: MouseProps;
	mouseEffectRadius = 50;

	constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
		this.ctx = ctx;
		this.width = width;
		this.height = height;
		this.particles = [];

		this.center = [Math.floor(width * 0.5), Math.floor(height * 0.5)];
		this.offset = [...this.center];
		this.offsetDimensions = [0, 0];

		this.mouse = {
			x: 0,
			y: 0,
		};

		document.addEventListener("mousemove", (e) => {
			this.handleMouseMove(e);
		});
	}

	private handleMouseMove(e: MouseEvent) {
		this.mouse.x = e.clientX;
		this.mouse.y = e.clientY;
	}

	private updateOffset(width: number, height: number) {
		this.offsetDimensions = [width, height];

		this.offset = [
			Math.floor(this.center[0] - width * 0.5),
			Math.floor(this.center[1] - height * 0.5),
		];
	}

	init(img: HTMLImageElement) {
		this.updateOffset(img.width, img.height);
		this.ctx.drawImage(img, this.offset[0], this.offset[1]);

		const pixels = this.ctx.getImageData(
			this.offset[0],
			this.offset[1],
			this.offsetDimensions[0],
			this.offsetDimensions[1],
		).data;

		let color = "";
		let alpha = 0;
		let index = 0;

		for (let y = 0; y < this.offsetDimensions[1]; y += this.resolutionPx) {
			for (let x = 0; x < this.offsetDimensions[0]; x += this.resolutionPx) {
				index = (y * this.offsetDimensions[0] + x) * 4;

				alpha = pixels[index + 3];
				if (!alpha) continue;

				color = `rgba(${pixels[index]}, ${pixels[index + 1]}, ${pixels[index + 2]}, ${alpha})`;
				this.particles.push(
					new Particle(
						this,
						this.ctx,
						this.offset[0] + x,
						this.offset[1] + y,
						color,
						this.resolutionPx,
					),
				);
			}
		}
	}

	draw() {
		this.ctx.clearRect(0, 0, this.width, this.height);

		for (let i = 0; i < this.particles.length; i++) {
			this.particles[i].update();
			this.particles[i].draw();
		}
	}
}

type Vector2D = [number, number];

type MouseProps = {
	x: number;
	y: number;
};
