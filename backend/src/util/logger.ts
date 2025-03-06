const logger = (log: string) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${log}`);
};

export { logger };
