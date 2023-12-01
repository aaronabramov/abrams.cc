export const measureTime = (fn: Function): number => {
  const start = performance.now(); // Start the timer
  fn(); // Execute the passed function
  const end = performance.now(); // End the timer

  const executionTime = end - start; // Calculate execution time
  console.log(`Execution Time: ${executionTime} milliseconds`); // Log execution time

  return executionTime; // Return the execution time
};
