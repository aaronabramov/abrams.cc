import { measureTime } from "../shared/logging";

const ITERATIONS = 1000000;

let LOGGING_ENABLED = false;
const log = (msg: string) => LOGGING_ENABLED && console.log(msg);
const time = (name: string) => LOGGING_ENABLED && console.time(name);
const timeEnd = (name: string) => LOGGING_ENABLED && console.timeEnd(name);

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

const printArraySizeMB = (array_size: number) => {
  const sizeInMb = (array_size * 64) / (8 * 1000 * 1000);
  log("--------------------------------------------------");
  log(`Array of ${array_size} numbers uses ${sizeInMb}MB of memory`);
};

const sequentialAccess = (arraySizeInMb: number) => {
  const arraySize = MemoryInMbToArraySize(arraySizeInMb);
  const arr = new Array(arraySize).fill(null).map(() => Math.random());
  const sequentialAccessIndexes = new Array(arraySize)
    .fill(null)
    .map((_, i) => i);

  time("Sequential Access");
  let result = 0;
  for (let i = 0; i < ITERATIONS; i++) {
    const index = i % arraySize;
    result = result ^ arr[sequentialAccessIndexes[index]];
  }
  timeEnd("Sequential Access");
};

const randomAccess = (arraySizeInMb: number) => {
  const arraySize = MemoryInMbToArraySize(arraySizeInMb);
  const arr = new Array(arraySize).fill(null).map(() => Math.random());
  const randomAccessIndexes = new Array(arraySize)
    .fill(null)
    .map((_) => Math.floor(Math.random() * arraySize));

  time("Random Access");
  let result = 0;
  for (let i = 0; i < ITERATIONS; i++) {
    const index = i % arraySize;
    result = result ^ arr[randomAccessIndexes[index]];
  }
  timeEnd("Random Access");
};

const runWithMemory = (memoryInMb: number) => {
  // let it warm up
  LOGGING_ENABLED = false;
  sequentialAccess(memoryInMb);
  randomAccess(memoryInMb);

  LOGGING_ENABLED = true;
  log("\n\n");
  sequentialAccess(memoryInMb);
  randomAccess(memoryInMb);
};

runWithMemory(1);
// runWithMemory(2);
// runWithMemory(3);
runWithMemory(15);
runWithMemory(16);
runWithMemory(17);
runWithMemory(18);
runWithMemory(19);
runWithMemory(20);
