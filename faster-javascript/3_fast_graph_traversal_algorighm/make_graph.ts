import { TGraph } from "./types";

const RANDOM_ANIMALS = [
	"cat",
	"dog",
	"elephant",
	"giraffe",
	"hippopotamus",
	"horse",
	"monkey",
	"moose",
	"penguin",
	"platypus",
	"rhinoceros",
	"squirrel",
	"tiger",
	"turtle",
	"walrus",
	"whale",
	"zebra",
];

const makeNodeName = (i: number): string => {
	const segments = [
		RANDOM_ANIMALS[i % RANDOM_ANIMALS.length],
		RANDOM_ANIMALS[i % RANDOM_ANIMALS.length],
		RANDOM_ANIMALS[i % RANDOM_ANIMALS.length],
		RANDOM_ANIMALS[i % RANDOM_ANIMALS.length],
		RANDOM_ANIMALS[i % RANDOM_ANIMALS.length],
		RANDOM_ANIMALS[i % RANDOM_ANIMALS.length],
	];

	return segments.join("/") + `/node-${i}.js`;
};

export const makeGraph = (nodes: number, edges: number): TGraph => {
	const graph: TGraph = {};

	for (let i = 0; i < nodes; i++) {
		graph[makeNodeName(i)] = {
			children: [],
			size_bytes: Math.floor(Math.random() * 1000),
		};
	}

	const allNames = Object.keys(graph);

	for (let i = 0; i < edges; i++) {
		const from = allNames[Math.floor(Math.random() * allNames.length)];
		const to = allNames[Math.floor(Math.random() * allNames.length)];

		graph[from].children.push(to);
	}

	return graph;
};
