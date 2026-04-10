"use client";

import { useAccount, useModal, useClient } from "@getpara/react-sdk";

function truncateAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function AuthButton() {
  const { isConnected, embedded } = useAccount();
  const { openModal } = useModal();
  const para = useClient();

  if (!isConnected) {
    return (
      <button
        onClick={() => openModal()}
        className="rounded-md bg-gray-900 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
      >
        Sign In
      </button>
    );
  }

  const wallets = embedded?.wallets ?? [];
  const evmWallet = wallets.find((w) => w.type === "EVM");
  const displayAddress = evmWallet?.address
    ? truncateAddress(evmWallet.address)
    : "Connected";

  const handleSignOut = async () => {
    if (!para) return;
    await para.logout();
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-mono text-gray-600">{displayAddress}</span>
      <button
        onClick={handleSignOut}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        Sign Out
      </button>
    </div>
  );
}
