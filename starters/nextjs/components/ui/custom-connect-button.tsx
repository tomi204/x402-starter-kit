'use client';

import { useAppKit, useAppKitAccount } from '@reown/appkit/react';

export function CustomConnectButton() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  const handleClick = () => {
    open();
  };

  if (isConnected && address) {
    return (
      <button
        onClick={handleClick}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-red-600/50"
      >
        {address.slice(0, 6)}...{address.slice(-4)}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-red-600/50 hover:-translate-y-0.5"
    >
      Connect Wallet
    </button>
  );
}
