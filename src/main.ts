export async function main(): Promise<void> {
  console.log("Hello, world!");
}

// Execute main function if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  await main().catch(console.error);
}
