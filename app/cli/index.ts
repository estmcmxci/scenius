export {};

const command = process.argv[2];
const args = process.argv.slice(3);

async function main() {
  switch (command) {
    case "resolve": {
      const { resolveCommand } = await import("./resolve");
      await resolveCommand();
      break;
    }
    case "snapshot": {
      if (!args[0]) {
        console.error("Usage: pnpm cli snapshot <soundcloud-url>");
        process.exit(1);
      }
      const { snapshotCommand } = await import("./snapshot");
      await snapshotCommand(args[0]);
      break;
    }
    default:
      console.error(`Unknown command: ${command}`);
      console.error("Available commands: resolve, snapshot");
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
