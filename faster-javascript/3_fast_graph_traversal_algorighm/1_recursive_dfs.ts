import { ComputeTransitiveSizes, TGraph, TTransitiveSizes } from "./types";

const dfs = (graph: TGraph, start: string, visited: Set<string>): number => {
	if (visited.has(start)) {
		return 0;
	}

	visited.add(start);

	const node = graph[start];
	let totalSize = node.size_bytes;
	for (let i = 0; i < node.children.length; i++) {
		const child = node.children[i];
		if (!visited.has(child)) {
			totalSize += dfs(graph, child, visited);
		}
	}
	return totalSize;
};

export class RecursiveDFS extends ComputeTransitiveSizes {
	private result: TTransitiveSizes = {};
	private allNames: string[];

	constructor(graph: TGraph) {
		super(graph);
		this.allNames = Object.keys(graph);
	}

	prepare(): void {}

	run() {
		this.result = {};

		for (const node of this.allNames) {
			this.result[node] = dfs(this.graph, node, new Set<string>());
		}
	}

	finalize(): TTransitiveSizes {
		return this.result;
	}
}
