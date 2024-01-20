'use client';
import { ConnectKitButton } from "connectkit";

export const ConnectButton = () => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <button
            onClick={show}
            className={`cursor-pointer relative inline-block px-6 py-4 text-white text-lg font-medium rounded-full transition duration-200 ease ${
              isConnected
                ? "bg-blue-500 hover:translate-y-6 hover:shadow-2xl active:translate-y-3 active:shadow-xl"
                : "bg-blue-500 hover:translate-y-6 hover:shadow-2xl active:translate-y-3 active:shadow-xl"
            }`}
          >
            {isConnected ? (ensName ?? truncatedAddress) : "Connect Wallet"}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};
