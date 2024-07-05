import { ComputeTransitiveSizes, TGraph, TTransitiveSizes } from "./types";

export class IDXGraph {
	stringToIDX: Map<string, number>;
	idxToString: Map<number, string>;
	nodeCount: number;
	nodes: Array<{ children: number[]; sizeBytes: number }> = [];

	constructor(graph: TGraph) {
		const stringToIDX = new Map<string, number>();
		const idxToString = new Map<number, string>();

		const nodeNames = Object.keys(graph);
		for (let i = 0; i < nodeNames.length; i++) {
			const nodeName = nodeNames[i];
			stringToIDX.set(nodeName, i);
			idxToString.set(i, nodeName);
		}

		for (let i = 0; i < nodeNames.length; i++) {
			const nodeName = nodeNames[i];
			const node = graph[nodeName];
			const children = node.children.map(
				(child) => stringToIDX.get(child) as number,
			);
			this.nodes[i] = {
				children,
				sizeBytes: node.size_bytes,
			};
		}
		this.stringToIDX = stringToIDX;
		this.idxToString = idxToString;
		this.nodeCount = nodeNames.length;
	}

	transitiveSizes(result: number[]): TTransitiveSizes {
		const stringResult: { [key: string]: number } = {};
		for (let i = 0; i < result.length; i++) {
			const nodeName = this.idxToString.get(i) as string;
			const size = result[i] as number;
			stringResult[nodeName] = size;
		}
		return stringResult;
	}
}

export class StringInterning extends ComputeTransitiveSizes {
	idxGraph: IDXGraph;
	result: number[] = [];

	constructor(graph: TGraph) {
		super(graph);
		this.idxGraph = new IDXGraph(graph);
	}

	prepare(): void {
		this.result = [];
	}

	run() {
		const result: number[] = [];

		for (let i = 0; i < this.idxGraph.nodeCount; i++) {
			const visited = new Set<number>();
			const stack = [i];
			let totalSize = 0;

			while (stack.length > 0) {
				const next = stack.pop() as number;
				if (visited.has(next)) {
					continue;
				}
				visited.add(next);
				totalSize += this.idxGraph.nodes[next].sizeBytes;
				const node = this.idxGraph.nodes[next];
				for (const child of node.children) {
					if (!visited.has(child)) {
						stack.push(child);
					}
				}
			}
			result[i] = totalSize;
		}
		this.result = result;
	}

	finalize(): TTransitiveSizes {
		return this.idxGraph.transitiveSizes(this.result);
	}
}

export class WithArrayVisited extends ComputeTransitiveSizes {
	idxGraph: IDXGraph;
	result: number[] = [];

	constructor(graph: TGraph) {
		super(graph);
		this.idxGraph = new IDXGraph(graph);
	}

	prepare(): void {
		this.result = [];
	}

	run() {
		const result: number[] = [];
		const visited = new Array(this.idxGraph.nodeCount);

		for (let i = 0; i < this.idxGraph.nodeCount; i++) {
			visited.fill(false);
			const stack = [i];
			let totalSize = 0;

			while (stack.length > 0) {
				const next = stack.pop() as number;
				if (visited[next]) {
					continue;
				}
				visited[next] = true;
				totalSize += this.idxGraph.nodes[next].sizeBytes;
				const node = this.idxGraph.nodes[next];
				for (const child of node.children) {
					if (!visited[child]) {
						stack.push(child);
					}
				}
			}
			result[i] = totalSize;
		}
		this.result = result;
	}

	finalize(): TTransitiveSizes {
		return this.idxGraph.transitiveSizes(this.result);
	}
}
