import React, { useState} from "react";
import * as ethers from "ethers";
import { X } from "react-feather";
import { GlobalStyles, UnstyledButton, OutlinedButton, Wrapper, Card, Dot, VStack, HStack, Overlay, Divider, HelpIndicator} from "../styles/Styles";


/** Main app */
export default function App() {
  const walletAddress = useWalletAddress();
  const chainId = useChainId();

  const [contracts, setContracts] = useReplitDBStorage("contracts", []);
  const [showError, setShowError] = useState(false);
  const [errors, setErrors] = useState(null);

  React.useEffect(() => {
    setShowError(true);
  }, [errors]);

  if (typeof window.ethereum === "undefined") {
    return (
      <VStack
        style={{
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: "var(--space-8)",
          padding: 40,
        }}
      >
        <h1 style={{ textAlign: "center" }}>Replit 🤝 Ethereum</h1>
        <a
          style={{ whiteSpace: "nowrap" }}
          href="https://metamask.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="primary">Install Metamask 🦊</button>
        </a>
        <p style={{ color: "var(--fg-dimmest)", textAlign: "center" }}>
          MetaMask is a Chrome Extension that lets you approve Ethereum
          transactions
        </p>

        <p
          style={{
            color: "var(--fg-dimmest)",
            textAlign: "center",
          }}
        >
          Once MetaMask is installed, this page should
          <a href="/"> refresh </a>
          automatically
        </p>

        <GlobalStyles />
        <ReloadOnRefocus />
      </VStack>
    );
  }

  return (
    <Wrapper>
      <GlobalStyles />
      {/* ERROR DIALOG 
      automatically opens on error but can be reopened with the error button
      */}
      {errors && showError ? (
        <Overlay>
          <VStack
            style={{
              width: "75%",
              maxWidth: "400px",
              backgroundColor: "var(--bg-default)",
              border: "1px solid var(--outline-default)",
              padding: "var(--space-16)",
              borderRadius: "var(--br-8)",
            }}
          >
            <HStack
              style={{
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h1>Error</h1>
              <UnstyledButton onClick={() => setShowError(false)}>
                <X size={16} />
              </UnstyledButton>
            </HStack>
            <pre className="code-error">
              {errors.map((e) => e.formattedMessage || e.message).join("\n\n")}
            </pre>
          </VStack>
        </Overlay>
      ) : null}

      {/* HEADER */}
      <HStack
        className="main-header"
        style={{
          width: "100%",
          justifyContent: "space-between",
          paddingBottom: "var(--space-16)",
        }}
      >
        <VStack>
          <h1
            className="main-title"
            style={{ paddingBottom: "var(--space-8)" }}
          >
            Replit 🤝 Ethereum
          </h1>
          {walletAddress && <ChainInfo chainId={chainId} />}
        </VStack>

        {walletAddress ? (
          <VStack style={{ alignItems: "end" }}>
            <HStack
              className="address-balance"
              style={{ alignItems: "center", paddingBottom: "var(--space-8)" }}
            >
              <Balance
                style={{ marginRight: "var(--space-16)" }}
                chainId={chainId}
                walletAddress={walletAddress}
              />
              <Address address={ethers.utils.getAddress(walletAddress)} />
            </HStack>

            <FaucetLink chainId={chainId} walletAddress={walletAddress} />
          </VStack>
        ) : (
          <button className="primary" onClick={connect}>
            Connect wallet
          </button>
        )}
      </HStack>

      <Divider style={{ marginBottom: "var(--space-24)" }} />

      {/* DEPLOYMENT */}
      <HStack
        className="deployment-header"
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "var(--space-16)",
        }}
      >
        <h2>Deployed contracts</h2>
        {walletAddress && (
          <Deployer
            chainId={chainId}
            walletAddress={walletAddress}
            onDeployed={(contract) => setContracts([...contracts, contract])}
            onClickError={() => setShowError(true)}
            onError={(errors) => {
              setErrors(Array.isArray(errors) ? errors : [errors]);
            }}
          />
        )}
      </HStack>

      {/* CONTRACTS */}
      {walletAddress && contracts.length > 0 ? (
        Object.entries(groupBy(contracts, "chainId")).map(
          ([groupChainId, groupedContracts]) => {
            const { name } = chainById(Number(groupChainId));
            const isActive = chainId === Number(groupChainId);

            return (
              <VStack>
                <h3
                  style={{
                    color: isActive ? "var(--fg-default)" : "var(--fg-dimmest)",
                  }}
                >
                  {name}
                </h3>
                {groupedContracts
                  .slice(0)
                  // show new contracts first.
                  .reverse()
                  .map((contract) => (
                    <ContractUI
                      key={contract.address}
                      contract={contract}
                      chainId={Number(groupChainId)}
                      chainIsActive={isActive}
                      onRemove={() => {
                        if (
                          confirm(
                            "Are you sure you want to remove this contract? It will still exist on the network, but you won't be able to interact with it in this UI anymore."
                          )
                        ) {
                          setContracts(
                            contracts
                              .slice(0)
                              .reverse()
                              .filter((c) => c !== contract)
                          );
                        }
                      }}
                    />
                  ))}
              </VStack>
            );
          }
        )
      ) : (
        <VStack
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            border: "1px solid var(--outline-dimmer)",
            borderRadius: "var(--br-8)",
            padding: "var(--space-8)",
          }}
        >
          <h2 style={{ color: "var(--fg-default)" }}>gm️</h2>
          <p style={{ color: "var(--fg-dimmest)" }}>
            no contracts deployed yet
          </p>
        </VStack>
      )}
    </Wrapper>
  );
}