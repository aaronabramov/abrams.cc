import { ComputeTransitiveSizes, TGraph, TTransitiveSizes } from "./types";

export class OffsetGraph {
	edges: number[];
	offsets: number[];
	sizes_bytes: number[];
	stringToIDX: Map<string, number>;
	idxToString: string[];

	constructor(graph: TGraph) {
		this.idxToString = Object.keys(graph);
		this.stringToIDX = new Map();

		for (let idx = 0; idx < this.idxToString.length; idx++) {
			this.stringToIDX.set(this.idxToString[idx], idx);
		}

		this.edges = [];
		this.offsets = [0];
		this.sizes_bytes = [];

		for (let idx = 0; idx < this.idxToString.length; idx++) {
			const nodeName = this.idxToString[idx];
			const node = graph[nodeName];

			this.sizes_bytes.push(node.size_bytes);

			for (const child of node.children) {
				this.edges.push(this.stringToIDX.get(child) as number);
			}

			this.offsets.push(this.edges.length);
		}
	}

	transitiveSizes(result: number[]): TTransitiveSizes {
		const stringResult: { [key: string]: number } = {};
		for (let i = 0; i < this.idxToString.length; i++) {
			const nodeName = this.idxToString[i];
			const size = result[i];
			stringResult[nodeName] = size;
		}
		return stringResult;
	}
}

export class OffsetGraphDFS extends ComputeTransitiveSizes {
	OffsetGraph: OffsetGraph;
	result: number[] = [];

	constructor(graph: TGraph) {
		super(graph);
		this.OffsetGraph = new OffsetGraph(graph);
	}

	prepare(): void {
		this.result = [];
	}

	run() {
		const result: number[] = [];
		const nodeCount = this.OffsetGraph.idxToString.length;

		const visited = new Array(nodeCount);
		const graph = this.OffsetGraph;
		const { offsets, edges, sizes_bytes } = graph;

		for (let i = 0; i < nodeCount; i++) {
			visited.fill(false);
			const stack = [i];
			let totalSize = 0;

			while (stack.length > 0) {
				const next = stack.pop() as number;
				if (visited[next]) {
					continue;
				}
				visited[next] = true;
				totalSize += sizes_bytes[next];

				const start = offsets[next];
				const end = offsets[next + 1];

				for (let j = start; j < end; j++) {
					const childIDX = edges[j];
					if (!visited[childIDX]) {
						stack.push(childIDX);
					}
				}
			}
			result[i] = totalSize;
		}
		this.result = result;
	}

	finalize(): TTransitiveSizes {
		return this.OffsetGraph.transitiveSizes(this.result);
	}
}

export class OffsetGraphU32 {
	edges: Uint32Array;
	offsets: Uint32Array;
	sizes_bytes: Uint32Array;
	stringToIDX: Map<string, number>;
	idxToString: string[];

	constructor(graph: TGraph) {
		this.idxToString = Object.keys(graph);
		this.stringToIDX = new Map();

		for (let idx = 0; idx < this.idxToString.length; idx++) {
			this.stringToIDX.set(this.idxToString[idx], idx);
		}

		const edges = [];
		const offsets = [0];
		const sizes_bytes = [];

		for (let idx = 0; idx < this.idxToString.length; idx++) {
			const nodeName = this.idxToString[idx];
			const node = graph[nodeName];

			sizes_bytes.push(node.size_bytes);

			for (const child of node.children) {
				edges.push(this.stringToIDX.get(child) as number);
			}

			offsets.push(edges.length);
		}

		this.edges = new Uint32Array(edges);
		this.offsets = new Uint32Array(offsets);
		this.sizes_bytes = new Uint32Array(sizes_bytes);
	}

	transitiveSizes(result: number[]): TTransitiveSizes {
		const stringResult: { [key: string]: number } = {};
		for (let i = 0; i < this.idxToString.length; i++) {
			const nodeName = this.idxToString[i];
			const size = result[i];
			stringResult[nodeName] = size;
		}
		return stringResult;
	}
}

export class OffsetGraphDFSU32 extends ComputeTransitiveSizes {
	OffsetGraph: OffsetGraph;
	result: number[] = [];

	constructor(graph: TGraph) {
		super(graph);
		this.OffsetGraph = new OffsetGraph(graph);
	}

	prepare(): void {
		this.result = [];
	}

	run() {
		const result: number[] = [];
		const nodeCount = this.OffsetGraph.idxToString.length;

		const visited = new Uint8Array(nodeCount);
		const graph = this.OffsetGraph;
		const { offsets, edges, sizes_bytes } = graph;

		for (let i = 0; i < nodeCount; i++) {
			visited.fill(0);
			const stack = [i];
			let totalSize = 0;

			while (stack.length > 0) {
				const next = stack.pop() as number;
				if (visited[next] === 1) {
					continue;
				}
				visited[next] = 1;
				totalSize += sizes_bytes[next];

				const start = offsets[next];
				const end = offsets[next + 1];

				for (let j = start; j < end; j++) {
					const childIDX = edges[j];
					if (visited[childIDX] === 0) {
						stack.push(childIDX);
					}
				}
			}
			result[i] = totalSize;
		}
		this.result = result;
	}

	finalize(): TTransitiveSizes {
		return this.OffsetGraph.transitiveSizes(this.result);
	}
}
