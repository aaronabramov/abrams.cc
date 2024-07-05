import React, { useMemo, useCallback } from "react";
import { AreaClosed, Line, Bar } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { GridRows, GridColumns } from "@visx/grid";
import { scaleLinear } from "@visx/scale";
import {
	withTooltip,
	Tooltip,
	TooltipWithBounds,
	defaultStyles,
} from "@visx/tooltip";
import { WithTooltipProvidedProps } from "@visx/tooltip/lib/enhancers/withTooltip";
import { Axis, Orientation } from "@visx/axis";
import { GradientDarkgreenGreen } from "@visx/gradient";
import { localPoint } from "@visx/event";
import { LinearGradient } from "@visx/gradient";
import { max, extent, bisector } from "@visx/vendor/d3-array";
import { ParentSize } from "@visx/responsive";

import dataJSON from "../faster-javascript/2_cpu_cache_layers/results.json";

const M1_L2_SIZE_MB = 8;

type Point = {
	sizeMB: number;
	seqMean: number;
	randMean: number;
};

const data: Array<Point> = dataJSON;
type TooltipData = Point;

export const background = "#3b6978";
export const background2 = "#204051";
export const accentColor = "#edffea";
export const accentColorDark = "#75daad";
const tooltipStyles = {
	...defaultStyles,
	background,
	border: "1px solid white",
	color: "white",
};

const tickLabelProps = {
	fill: "#fff",
	fontSize: 12,
	fontFamily: "sans-serif",
	textAnchor: "middle",
} as const;

const getMem = (point: Point) => point.sizeMB;
const getSeqRuntime = (point: Point) => point.seqMean;
const getRanRuntime = (point: Point) => point.randMean;

const bisectMem = bisector<Point, number>((p) => p.sizeMB).left;

export type AreaProps = {
	width: number;
	height: number;
	margin?: { top: number; right: number; bottom: number; left: number };
};

export default () => (
	<div style={{ width: "100%", height: "300px" }}>
		<ParentSize>
			{({ width, height }) => <Chart width={width} height={height} />}
		</ParentSize>
	</div>
);

const Chart = withTooltip<AreaProps, TooltipData>(
	({
		width,
		height,
		margin = { top: 0, right: 40, bottom: 45, left: 0 },
		showTooltip,
		hideTooltip,
		tooltipData,
		tooltipTop = 0,
		tooltipLeft = 0,
	}: AreaProps & WithTooltipProvidedProps<TooltipData>) => {
		if (width < 10) return null;

		// bounds
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		// scales
		const memScale = useMemo(
			() =>
				scaleLinear({
					range: [margin.left, innerWidth + margin.left],
					domain: extent(data, getMem) as [number, number],
				}),
			[innerWidth, margin.left],
		);

		const runtimeScale = useMemo(() => {
			const maxRuntime = max(data, getRanRuntime) || 0;
			const domain = [0, maxRuntime];
			console.log({ maxRuntime, domain });
			return scaleLinear({
				range: [innerHeight + margin.top, margin.top],
				domain,
				nice: true,
			});
		}, [margin.top, innerHeight]);

		// tooltip handler
		const handleTooltip = useCallback(
			(
				event:
					| React.TouchEvent<SVGRectElement>
					| React.MouseEvent<SVGRectElement>,
			) => {
				const { x } = localPoint(event) || { x: 0 };
				const x0 = memScale.invert(x);
				const index = bisectMem(data, x0, 1);
				const d0 = data[index - 1];
				const d1 = data[index];
				let d = d0;
				if (d1 && getMem(d1)) {
					d =
						x0.valueOf() - getMem(d0).valueOf() >
						getMem(d1).valueOf() - x0.valueOf()
							? d1
							: d0;
				}
				showTooltip({
					tooltipData: d,
					tooltipLeft: x,
					tooltipTop: runtimeScale(getRanRuntime(d)),
				});
			},
			[showTooltip, runtimeScale, memScale],
		);

		return (
			<div>
				<svg width={width} height={height}>
					<rect
						x={0}
						y={0}
						width={width}
						height={height}
						fill="url(#area-background-gradient)"
						rx={14}
					/>
					<LinearGradient
						id="area-background-gradient"
						from={background}
						to={background2}
					/>
					<LinearGradient
						id="area-gradient"
						from={accentColor}
						to={accentColor}
						toOpacity={0.1}
					/>
					<GradientDarkgreenGreen id="fancy-gradient" />
					<GridRows
						left={margin.left}
						scale={runtimeScale}
						width={innerWidth}
						strokeDasharray="1,3"
						stroke={accentColor}
						strokeOpacity={0}
						pointerEvents="none"
					/>
					<GridColumns
						top={margin.top}
						scale={memScale}
						height={innerHeight}
						strokeDasharray="1,3"
						stroke={accentColor}
						strokeOpacity={0.2}
						pointerEvents="none"
					/>
					<AreaClosed<Point>
						data={data}
						x={(d) => memScale(getMem(d)) ?? 0}
						y={(d) => runtimeScale(getRanRuntime(d)) ?? 0}
						yScale={runtimeScale}
						strokeWidth={1}
						stroke="url(#area-gradient)"
						fill="url(#area-gradient)"
						curve={curveMonotoneX}
					/>
					<AreaClosed<Point>
						data={data}
						x={(d) => memScale(getMem(d)) ?? 0}
						y={(d) => runtimeScale(getSeqRuntime(d)) ?? 0}
						yScale={runtimeScale}
						strokeWidth={1}
						stroke="url(#area-gradient)"
						fill="url(#area-gradient)"
						curve={curveMonotoneX}
					/>
					<Bar
						x={margin.left}
						y={margin.top}
						fill="transparent"
						height={innerHeight}
						width={innerWidth}
						rx={14}
						onTouchStart={handleTooltip}
						onTouchMove={handleTooltip}
						onMouseMove={handleTooltip}
						onMouseLeave={() => hideTooltip()}
					/>
					<Line
						from={{ x: memScale(M1_L2_SIZE_MB), y: margin.top }}
						to={{ x: memScale(M1_L2_SIZE_MB), y: innerHeight + margin.top }}
						stroke={"#750202"}
						strokeWidth={2}
						pointerEvents="none"
						strokeDasharray="5,2"
					/>
					<Axis
						orientation={Orientation.bottom}
						top={height - margin.bottom}
						scale={memScale}
						tickFormat={(p) => `${p}MB`}
						stroke={"#fff"}
						tickStroke={"#fff"}
						tickLabelProps={tickLabelProps}
						numTicks={8}
						label={"Array Size (MB)"}
						labelProps={{
							// x: width + 30,
							// y: -10,
							dy: -10,
							dx: -30,
							fill: "#fff",
							fontSize: 14,
							strokeWidth: 0,
							stroke: "#fff",
							paintOrder: "stroke",
							fontFamily: "sans-serif",
							textAnchor: "start",
						}}
					/>

					<Axis
						orientation={Orientation.right}
						left={width - margin.right}
						scale={runtimeScale}
						tickFormat={(p) => `${p}`}
						stroke={"#fff"}
						tickStroke={"#fff"}
						tickLabelProps={{ ...tickLabelProps, x: 15, dy: -4 }}
						numTicks={6}
						// tickTransform="translate(10, 0)"
						label={"TIME (ms)"}
						labelProps={{
							// x: width + 30,
							// y: -10,
							dx: 4,
							fill: "#fff",
							fontSize: 14,
							strokeWidth: 0,
							stroke: "#fff",
							// paintOrder: "stroke",
							// fontFamily: "sans-serif",
							// textAnchor: "start",
						}}
					/>
					{tooltipData && (
						<g>
							<Line
								from={{ x: tooltipLeft, y: margin.top }}
								to={{ x: tooltipLeft, y: innerHeight + margin.top }}
								stroke={accentColorDark}
								strokeWidth={2}
								pointerEvents="none"
								strokeDasharray="5,2"
							/>
							<circle
								cx={tooltipLeft}
								cy={tooltipTop + 1}
								r={4}
								fill="black"
								fillOpacity={0.1}
								stroke="black"
								strokeOpacity={0.1}
								strokeWidth={2}
								pointerEvents="none"
							/>
							<circle
								cx={tooltipLeft}
								cy={tooltipTop}
								r={4}
								fill={accentColorDark}
								stroke="white"
								strokeWidth={2}
								pointerEvents="none"
							/>
						</g>
					)}
				</svg>
				{tooltipData && (
					<div>
						<TooltipWithBounds
							key={Math.random()}
							top={tooltipTop - 12}
							left={tooltipLeft + 12}
							style={tooltipStyles}
						>
							{makeTooltipLabel(tooltipData)}
						</TooltipWithBounds>
						<Tooltip
							top={innerHeight + margin.top - 14}
							left={tooltipLeft}
							style={{
								...defaultStyles,
								minWidth: 72,
								textAlign: "center",
								transform: "translateX(-50%)",
							}}
						>
							{`${getMem(tooltipData)}MB`}
						</Tooltip>
					</div>
				)}
			</div>
		);
	},
);

const makeTooltipLabel = (tooltipData: TooltipData) => {
	const seq = getSeqRuntime(tooltipData).toFixed(1);
	const rand = getRanRuntime(tooltipData).toFixed(1);
	return `SEQ: ${seq}ms / RAND: ${rand}ms`;
};
