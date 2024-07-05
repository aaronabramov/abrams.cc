import { ComputeTransitiveSizes, TGraph, TTransitiveSizes } from "./types";

export class Iterative extends ComputeTransitiveSizes {
	private result: TTransitiveSizes = {};
	private allNames: string[];

	constructor(graph: TGraph) {
		super(graph);
		this.allNames = Object.keys(graph);
	}

	prepare(): void {}

	run() {
		this.result = {};
		const { graph } = this;

		for (const node of this.allNames) {
			const stack = [node];
			const visited = new Set();
			let totalSize = 0;

			while (stack.length > 0) {
				const next = stack.pop() as string;
				if (visited.has(next)) {
					continue;
				}
				visited.add(next);
				const node = graph[next];
				totalSize += node.size_bytes;

				for (let i = 0; i < node.children.length; i++) {
					const child = node.children[i];
					if (!visited.has(child)) {
						stack.push(child);
					}
				}
			}
			this.result[node] = totalSize;
		}
	}

	finalize(): TTransitiveSizes {
		return this.result;
	}
}
