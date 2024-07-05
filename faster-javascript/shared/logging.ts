export const measureTime = (fn: () => void): number => {
  const start = performance.now(); // Start the timer
  fn(); // Execute the passed function
  const end = performance.now();
  const executionTime = end - start;
  return executionTime;
};

export const measureAndPrintTime = (name: string, fn: () => void): number => {
  const executionTime = measureTime(fn);
  console.log(`Execution Time: ${executionTime} milliseconds. [${name}]`);
  return executionTime;
};
