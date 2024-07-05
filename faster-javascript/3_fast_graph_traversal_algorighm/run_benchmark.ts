import { RecursiveDFS } from "./1_recursive_dfs";
import { Iterative } from "./2_iterative";
import { StringInterning, WithArrayVisited } from "./3_string_interning";
import { OffsetGraphDFS, OffsetGraphDFSU32 } from "./4_offset_graph";
import { makeGraph } from "./make_graph";
import { TTransitiveSizes } from "./types";

const implementations = [
	RecursiveDFS,
	Iterative,
	StringInterning,
	WithArrayVisited,
	OffsetGraphDFS,
	OffsetGraphDFSU32,
];

const graph = makeGraph(1500, 15000);

const [_, resultsControl] = new WithArrayVisited(graph).benchmark();

const compareResults = (control: TTransitiveSizes, test: TTransitiveSizes) => {
	const keysA = Object.keys(control);
	const keysB = Object.keys(test);
	if (keysA.length !== keysB.length) {
		console.log(`Different number of results: ${keysA} !== ${keysB}`);
	}

	for (const key of keysA) {
		if (control[key] !== test[key]) {
			console.log(
				`Different results CTL: ${control[key]} !== TEST: ${test[key]} for ${key}: `,
			);
		}
	}
};

for (const impl of implementations) {
	const [msg, resultTest] = new impl(graph).benchmark();
	console.log(msg);
	compareResults(resultsControl, resultTest);
}
