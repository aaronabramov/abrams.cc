const RUNS = 3;

export type TNode = {
	children: string[];
	size_bytes: number;
};
export type TGraph = { [key: string]: TNode };
export type TTransitiveSizes = { [key: string]: number };

export abstract class ComputeTransitiveSizes {
	constructor(protected graph: TGraph) {}

	abstract prepare(): void;
	abstract run(): void;
	abstract finalize(): TTransitiveSizes;

	benchmark(): [string, TTransitiveSizes] {
		const allDurations = [];
		for (let i = 0; i < RUNS; i++) {
			this.prepare();
			const start = Date.now();
			this.run();
			const end = Date.now();
			allDurations.push(end - start);
		}

		const p50 = allDurations.sort()[Math.floor(RUNS / 2)];

		const className = this.constructor.name;
		return [`${className} p50 = ${p50}ms`, this.finalize()];
	}
}
