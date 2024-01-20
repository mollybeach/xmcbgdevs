'use client';
import React, { useState } from "react";

const ConnectWallet = () => {
  const [isConnectHighlighted, setIsConnectHighlighted] = useState(false);
  const [isNetworkSwitchHighlighted, setIsNetworkSwitchHighlighted] =
    useState(false);

  const closeAll = () => {
    setIsConnectHighlighted(false);
    setIsNetworkSwitchHighlighted(false);
  };

  const connectButtonStyle = {
    fontFamily: "Roboto",
    fontWeight: 400,
    borderRadius: "20px",
    overlayBackdropFilter: "blur(0px)",
    fontSize: "20px",
    color: "#373737",
    backgroundColor: "#F6F7F9",
    boxShadow: "0 0 0 0 #ffffff",
    transition: "background-color 0.3s, color 0.3s",
  };

  const networkSwitchButtonStyle = {
    fontFamily: "Roboto",
    fontWeight: 400,
    borderRadius: "20px",
    overlayBackdropFilter: "blur(0px)",
    fontSize: "16px",
    color: "#373737",
    backgroundColor: "#F6F7F9",
    boxShadow: "0px 2px 4px 0px #00000005",
    transition: "background-color 0.3s, color 0.3s",
  };

  return (
    <div
    style={{
        fontFamily: "Roboto",
        fontWeight: 400,
        borderRadius: "20px",
        backdropFilter: "blur(0px)",
        backgroundColor: "#b52f6c",
        color: "#ffffff",
    }}
    >
      {/* WalletConnect Header */}
      <div
        style={{
          fontFamily: "Source Code Pro",
          fontWeight: 700,
        }}
      >
        <div style={{ fontFamily: "Source Code Pro", fontWeight: 700 }}>
          <h2>Connect Wallet</h2>
        </div>
        <button
          onClick={closeAll}
                style={{
                    color: "#AAAAAB",
                }}
            >
                Close
            </button>
        </div>

        {/* WalletConnect Content */}
        <div>
        <p
          style={{
            fontFamily: "Source Code Pro",
            fontWeight: 400,
            color: "#838485",
          }}
        >
          Connect to a WalletConnect v2.0 compatible wallet.
        </p>
        <button
          onClick={() => {
            setIsConnectHighlighted(!isConnectHighlighted);
            setIsNetworkSwitchHighlighted(false);
          }}
          style={{
            ...connectButtonStyle,
            fontSize: "20px",
          }}
        >
          Connect Wallet
        </button>
        <button
          onClick={() => {
            setIsNetworkSwitchHighlighted(!isNetworkSwitchHighlighted);
            setIsConnectHighlighted(false);
          }}
          style={{
            ...networkSwitchButtonStyle,
            fontSize: "16px",
          }}
        >
          Select Network
        </button>
      </div>
    </div>
  );
};

export default ConnectWallet;
