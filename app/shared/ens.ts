import { JsonRpcProvider } from "ethers";

const ENS_CACHE = new Map<string, string | null>();

let provider: JsonRpcProvider | null = null;

function getProvider(): JsonRpcProvider {
  if (!provider) {
    provider = new JsonRpcProvider("https://cloudflare-eth.com");
  }
  return provider;
}

/**
 * Resolve an Ethereum address to its ENS name.
 * Returns null if no ENS name is set or resolution fails.
 * Results are cached in-memory to avoid repeated lookups.
 */
export async function resolveEnsName(
  address: string
): Promise<string | null> {
  if (ENS_CACHE.has(address)) {
    return ENS_CACHE.get(address) ?? null;
  }

  try {
    const name = await getProvider().lookupAddress(address);
    ENS_CACHE.set(address, name);
    return name;
  } catch {
    ENS_CACHE.set(address, null);
    return null;
  }
}
