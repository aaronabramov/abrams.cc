#!node --no-warnings --loader ts-node/esm

import { measureTime } from "../shared/logging";
import range from "lodash/range";
import mean from "lodash/mean";
import fs from "fs";
import sortBy from "lodash/sortBy";

const ITERATIONS = 1000000;

const LOGGING_ENABLED = false;
const log = (msg: string) => LOGGING_ENABLED && console.log(msg);

const MemoryInMbToArraySize = (memoryInMb: number) => {
  const memoryInBits =
    memoryInMb * 1000 /* to kb */ * 1000 /* to bytes */ * 8; /* to bits */
  const arraySize = memoryInBits / 64; /* 64 bits per `number` */

  // let's make it 5% smaller to make sure we can fit it even if there's some overhead
  const slightlyLessThanArraySize = Math.floor(arraySize - arraySize * 0.05);
  log("------------------------------------------");
  log(
    `Memory of ${memoryInMb}MB can hold array of ${slightlyLessThanArraySize} numbers`
  );
  return slightlyLessThanArraySize;
};

const measureForArraySizeMB = (arraySizeMB: number) => {
  const arraySize = MemoryInMbToArraySize(arraySizeMB);
  const arr = new Array(arraySize).fill(null).map(() => Math.random());

  const randomAccessIndexes = new Array(arraySize)
    .fill(null)
    .map((_) => Math.floor(Math.random() * arraySize));

  const seqAccessIndexes = new Array(arraySize).fill(null).map((_, i) => i);

  const seqTimes = [];
  const randTimes = [];

  let result = 0;

  for (let i = 0; i < 5; i++) {
    const seqTime = measureTime(() => {
      for (let i = 0; i < ITERATIONS; i++) {
        const index = i % arraySize;
        result = result ^ arr[seqAccessIndexes[index]];
      }
    });
    seqTimes.push(seqTime);

    const randTime = measureTime(() => {
      for (let i = 0; i < ITERATIONS; i++) {
        const index = i % arraySize;
        result = result ^ arr[randomAccessIndexes[index]];
      }
    });
    randTimes.push(randTime);
  }

  const seqMean = mean(seqTimes);
  const randMean = mean(randTimes);

  console.log("Array size: ", arraySizeMB);
  console.log("SEQ mean: ", seqMean);
  console.log("RAN mean: ", randMean);
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

  return { seqMean, randMean };
};

type Point = {
  sizeMB: number;
  seqMean: number;
  randMean: number;
};

const results: Array<Point> = [];
for (const i of range(1, 30 * 20)) {
  const sizeMB = i / 20;
  const { seqMean, randMean } = measureForArraySizeMB(sizeMB);
  results.push({ sizeMB, seqMean, randMean });
}

const path = "./results.json";
let existingData = [];
try {
  const existingDataJSON = fs.readFileSync(path, "utf-8");
  existingData = JSON.parse(existingDataJSON);
  console.log("Merging data with existing file");
} catch (_e) {
  console.log("No existing file found");
}

const byMem: { [key: number]: Array<Point> } = {};

for (const point of existingData) {
  byMem[point.sizeMB] = [point];
}

for (const point of results) {
  if (!byMem[point.sizeMB]) {
    byMem[point.sizeMB] = [];
  }
  byMem[point.sizeMB].push(point);
}

const mergedResults = Object.values(byMem).map((points) => {
  const seqMean = mean(points.map((p) => p.seqMean));
  const randMean = mean(points.map((p) => p.randMean));
  return { sizeMB: points[0].sizeMB, seqMean, randMean };
});

const sortedMergedResults = sortBy(mergedResults, (p) => p.sizeMB);

fs.writeFileSync(path, JSON.stringify(sortedMergedResults, null, 4));
console.log("Results saved to: ", path);
