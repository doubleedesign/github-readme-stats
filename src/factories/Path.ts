import type { Coordinates } from '../components/types.ts';

/**
 * A class to construct SVG path data strings for drawing arc shapes.
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorials/SVG_from_scratch/Paths#curve_commands
 */
export class Path {
	name = '';
	output = '';

	constructor(name: string) {
		// Give each path a name for debugging purposes
		this.name = name;
	}

	/**
	 * Move the current drawing point to the specified coordinates without drawing a line.
	 * @param pos
	 */
	from(pos: Coordinates) {
		this.output += ` M ${pos.x} ${pos.y}`;

		return this;
	}

	/**
	 * Draw a straight line from the current drawing point to the specified coordinates.
	 * @param pos
	 */
	lineTo(pos: Coordinates) {
		this.output += ` L ${pos.x} ${pos.y}`;

		return this;
	}

	/**
	 * Draw an arc to the specified coordinates.
	 * @param {number} rx - The x-radius of the ellipse (same as Y for a circle)
	 * @param {number} ry - The y-radius of the ellipse (same as X for a circle)
	 * @param {number} xAxisRotation - The rotation of the ellipse in degrees
	 * @param {number} largeArcFlag - 1 if the arc should be greater than 180 degrees, 0 otherwise
	 * @param {number} sweepFlag - 1 if the arc should be drawn in a "positive-angle" direction, 0 otherwise
	 * @param {Coordinates} endPoint - The end point of the arc
	 *
	 * @returns {Path} The current Path instance for chaining.
	 */
	arcTo(rx: number, ry: number, xAxisRotation: number, largeArcFlag: number, sweepFlag: number, endPoint: Coordinates): Path {
		this.output += ` A ${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${endPoint.x} ${endPoint.y}`;

		return this;
	}

	/**
	 * Close the current path by drawing a straight line back to the starting point.
	 *
	 * @returns {Path} The current Path instance for chaining.
	 */
	closePath(): Path {
		this.output += ' Z';

		return this;
	}

	/**
	 * Get the string representation of the path data
	 * to be used in the `d` attribute of an SVG `<path>` element.
	 */
	toString() {
		return this.output.trim();
	}

	/**
	 * Where zero is the 12 o'clock position, calculate which quadrant most of an arc falls into based on its start and end angles.
	 * @param startAngle
	 * @param endAngle
	 */
	getQuadrant(startAngle: number, endAngle: number): number {
		const midAngle = (startAngle + endAngle) / 2;

		if (midAngle >= 0 && midAngle < 90) {
			return 1;
		}
		else if (midAngle >= 90 && midAngle < 180) {
			return 2;
		}
		else if (midAngle >= 180 && midAngle < 270) {
			return 3;
		}
		else {
			return 4;
		}
	}

	getTransform(startAngle: number, endAngle: number, strokeWidth: number): string {
		const quadrant = this.getQuadrant(startAngle, endAngle);
		let translate = '';
		let scale = (100 - strokeWidth * 2);

		switch (quadrant) {
			case 1:
				translate = `-${strokeWidth}px, -${strokeWidth / 2}px`;
				break;
			case 2:
				translate = `-${strokeWidth}px, ${strokeWidth / 2}px`;
				break;
			case 3:
				translate = `${-strokeWidth * 2}px, ${strokeWidth / 2}px`;
				break;
			case 4:
				translate = `${-strokeWidth * 2}px, -${strokeWidth / 2}px`;
				break;
		}

		return `translate(${translate}) scale(${scale}%)`;
	}
}