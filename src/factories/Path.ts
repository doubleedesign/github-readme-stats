export class Path {
	output = '';

	from(x: number, y: number) {
		this.output += `M ${x} ${y}`;

		return this;
	}

	lineTo(x: number, y: number) {
		this.output += `L ${x} ${y}`;

		return this;
	}

	arcTo(rx: number, ry: number, xAxisRotation: number, largeArcFlag: number, sweepFlag: number, x: number, y: number) {
		this.output += `A ${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${x} ${y}`;

		return this;
	}

	closePath() {
		this.output += 'Z';

		return this;
	}

	toString() {
		return this.output;
	}
}