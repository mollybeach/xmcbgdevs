import React, { useState, useEffect, useCallback, useMemo } from "react";
import ReactDOM from "react-dom";
import * as ethers from "ethers";
import { getChainByChainId } from "evm-chains";
import { App } from "../components/App";

import { X, ChevronRight, Upload, Eye, Edit2, Play } from "react-feather";

// DO NOT EDIT THIS
const REPLIT_CHAIN_ID = 1919250540;

/** Main deployment + network functions */
async function connect() {
  window.ethereum.request({ method: "eth_requestAccounts" });
}

async function switchToChain(chainId) {
  if (chainId === REPLIT_CHAIN_ID) {
    // this will add the network if it hasn't been already.
    // otherwise it'll ask to switch
    switchToReplitTestnet();
  } else {
    window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${chainId.toString()}` }],
    });
  }
}

function switchToReplitTestnet() {
  ethereum.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: "0x7265706c",
        chainName: "Replit Testnet",
        rpcUrls: ["https://eth.replit.com"],
        iconUrls: [
          "https://upload.wikimedia.org/wikipedia/commons/b/b2/Repl.it_logo.svg",
        ],
        nativeCurrency: {
          name: "Replit ETH",
          symbol: "RΞ",
          decimals: 18,
        },
      },
    ],
  });
}

async function deploy(spec, name, chainId) {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const factory = new ethers.ContractFactory(
    spec.abi,
    spec.evm.bytecode.object,
    provider.getSigner()
  );
  const contract = await factory.deploy();
  await contract.deployed();

  return {
    address: contract.address,
    abi: spec.abi,
    name,
    chainId,
  };
}




// Copies text to clipboard with a fake input lol
function copy(text) {
  var inp = document.createElement("input");
  inp.style.position = "absolute";
  inp.style.opacity = 0;
  document.body.appendChild(inp);
  inp.value = text;
  inp.select();
  document.execCommand("copy", false);
  inp.remove();
}

// basic group by util
// will group an array of objects
// by some key inside those objects
function groupBy(list, key) {
  return list.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

function Address({ address }) {
  return (
    <OutlinedButton
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        cursor: "pointer",
      }}
      onClick={() => copy(address)}
      aria-label="Copy wallet address"
      data-microtip-position="bottom"
      role="tooltip"
    >
      {" "}
      <span
        style={{
          fontFamily: "var(--font-family-code)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "60px",
        }}
      >
        {address}
      </span>
    </OutlinedButton>
  );
}

function FaucetLink({ chainId, walletAddress }) {
  if (chainId === REPLIT_CHAIN_ID) {
    return <ReplitFaucetLink walletAddress={walletAddress} />;
  }

  const { faucets } = chainById(chainId);
	// console.log(faucets)
  return faucets.length > 0 ? (
    <a target="_blank" rel="noopener" href={faucets[0]}>
      Get Ether for testing{" "}
    </a>
  ) : null;
}

function ReplitFaucetLink({ walletAddress }) {
  const [fetching, setFetching] = useState(false);

  async function getEther(e) {
    e.preventDefault();
    setFetching(true);
    await fetch("https://testnet.util.repl.co/faucet/" + walletAddress);
    await new Promise((resolve) => setTimeout(resolve, 20 * 1000));
    setFetching(false);
  }

  if (fetching) {
    return (
      <span
        className={fetching && "animate-flicker"}
        style={{ color: "var(--fg-dimmest)", textAlign: "right" }}
      >
        Requesting 1 ETH...
      </span>
    );
  }

  return (
    <a style={{ textAlign: "right" }} href="#" onClick={getEther}>
      Get 1 ETH for testing
    </a>
  );
}

function Balance({ walletAddress, chainId }) {
  const balance = useBalance(walletAddress, chainId);

  if (balance === null) {
    return <span>Checking balance...</span>;
  }

  return (
    <span style={{ marginRight: "var(--space-8)", whiteSpace: "nowrap" }}>
      {ethers.utils.formatEther(balance).slice(0, 6)} ETH
    </span>
  );
}

function ChainInfo({ chainId }) {
  const { name } = chainById(chainId);

  return (
    <VStack style={{ alignItems: "start" }}>
      <HStack style={{ alignItems: "center" }}>
        <Dot style={{ marginRight: "var(--space-8)" }} color="lightgreen" />
        <span
          style={{
            color:
              chainId === 1
                ? "var(--accent-warning-default)"
                : "var(--fg-default)",
          }}
        >
          <span style={{ marginRight: "var(--space-8)" }}>{name}</span>

          <HelpIndicator
            text={
              chainId === 1
                ? "This is the primary network for Ethereum and uses real ETH for deployment"
                : "You are connected to a test network. Test networks let you deploy your contracts with fake ETH"
            }
          />
        </span>
      </HStack>
      {chainId === 1 && (
        <span
          onClick={switchToReplitTestnet}
          style={{
            color: "var(--accent-warning-dimmer)",
            textDecoration: "underline",
            textDecorationStyle: "dashed",
            cursor: "pointer",
            maxWidth: "240px",
          }}
        >
          Switch to a test network via MetaMask 🦊
        </span>
      )}
    </VStack>
  );
}

function Deployer({
  walletAddress,
  onDeployed,
  chainId,
  onError,
  onClickError,
}) {
  const [output, setOutput] = useState(null);
  const [path, setPath] = useState("");
  useEffect(() => {
    setPath((oldPath) => {
      if (!output || output.errors) {
        return oldPath;
      }

      let { file, name } = JSON.parse(path || "{}");
      if (file in output.contracts && name in output.contracts[file]) {
        return oldPath;
      }

      file = Object.keys(output.contracts).sort(
        (a, b) => a.length - b.length
      )[0];
      name = Object.keys(output.contracts[file])[0];
      return JSON.stringify({ file, name });
    });
  }, [output]);

  useEffect(() => {
    let running = true;
    async function loop() {
      let lastMtime = 0;
      while (running) {
        const res = await fetch("/watch/" + lastMtime);
        const jsn = await res.json();
        if (!jsn.changed) {
          continue;
        }

        lastMtime = jsn.mtime;

        if (jsn.errors) {
          console.info(jsn.errors);
          continue;
        }

        setOutput(jsn.output);
      }
    }

    loop();
    return () => {
      running = false;
    };
  }, []);

  const { watch, isRunning, error } = useAsyncStatus();

  if (!output) {
    return null;
  }

  // TODO: put this into a modal / tie the button to it
  if (output.errors) {
    onError(output.errors);

    return (
      <OutlinedButton
        onClick={onClickError}
        style={{
          borderColor: "var(--accent-negative-dimmer)",
          color: "var(--accent-negative-default)",
        }}
      >
        Fix solidity errors to deploy
      </OutlinedButton>
    );
  }

  // TODO: show rejection?
  // {error && <span style={{ color: 'red' }}>{error.error ?.message || error.message}</span>}

  return (
    <HStack className="deployer" style={{ alignItems: "stretch" }}>
      <select
        style={{
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
        value={path}
        onChange={(e) => setPath(e.target.value)}
      >
        {Object.keys(output.contracts).map((file) => (
          <optgroup key={file} label={file}>
            {Object.keys(output.contracts[file]).map((name) => (
              <option key={name} value={JSON.stringify({ file, name })}>
                {name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <button
        style={{
          whiteSpace: "nowrap",
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          border: "1px solid var(--outline-default)",
          padding: "0px 16px",
          gap: 8,
        }}
        disabled={!path || isRunning}
        onClick={() => {
          if (chainId === 1) {
            if (
              confirm(
                "You are connected to Mainnet, which means your personal ether will be used to deploy your contracts. We recommend switching to a test network in MetaMask 🦊."
              )
            ) {
              const { file, name } = JSON.parse(path);
              watch(deploy(output.contracts[file][name], name, chainId)).then(
                onDeployed,
                onError
              );
            }
          } else {
            const { file, name } = JSON.parse(path);
            watch(deploy(output.contracts[file][name], name, chainId)).then(
              onDeployed,
              onError
            );
          }
        }}
      >
        <Upload size={16} />
        <span className={isRunning && "animate-flicker"}>
          {isRunning ? "Deploying..." : "Deploy"}
        </span>
      </button>
    </HStack>
  );
}

const generalStateMutability = (stateMutability) => {
  if (stateMutability === "payable" || stateMutability === "nonpayable") {
    return "write";
  }

  return "read";
};

// Used for tooltips in each function viewer
// Simplify these definitions
const mutabilityStateDescriptions = {
  payable:
    "A payable function writes to the contract and requires you to send ETH to the recipient",
  view: "A view function accesses state variables in your contract",
  pure: "A pure function accesses non-state data in your contract",
  nonpayable:
    "A nonpayable function writes to the contract and does not require you to send ETH to the recipient",
};

function ContractUI({
  contract: { name, address, abi },
  onRemove,
  chainIsActive,
  chainId,
}) {
  const [isOpen, setIsOpen] = useState(false);
  // store the last results in memory.
  const [lastResults, setLastResults] = useState({});

  const provider = useMemo(
    () => new ethers.providers.Web3Provider(ethereum),
    []
  );
  const contractReadOnly = useMemo(
    () => new ethers.Contract(address, abi, provider),
    [address, abi, provider]
  );
  const contractReadWrite = useMemo(
    () => new ethers.Contract(address, abi, provider.getSigner()),
    [address, abi, provider]
  );

  // default to the first function.
  const [selectedFunction, setSelectedFunction] = useState(0);

  window.ccc = contractReadWrite;

  return (
    <VStack
      style={{
        backgroundColor: isOpen ? "var(--bg-default)" : "var(--bg-root)",
        border: "1px solid var(--outline-dimmest)",
        borderRadius: "var(--br-8)",
        marginBottom: "var(--space-16)",
        overflow: "hidden",
      }}
    >
      <HStack
        style={{
          padding: "var(--space-8)",
          borderBottom: isOpen ? "1px solid var(--outline-dimmest)" : "none",
        }}
      >
        <HStack
          style={{
            alignItems: "center",
            width: "100%",
            cursor: "pointer",
            gap: "var(--space-8)",
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <h2>{name}</h2>
          <ChevronRight
            size={16}
            style={{
              transform: isOpen ? "rotate(90deg)" : "none",
            }}
          />
        </HStack>
        <UnstyledButton onClick={onRemove}>
          <X size={16} />
        </UnstyledButton>
      </HStack>

      {/* FUNCTION EXPLORER UI */}
      {isOpen ? (
        <HStack style={{ width: "100%", overflow: "hidden" }}>
          <VStack
            className="function-list"
            style={{ width: "200px", minWidth: "120px" }}
          >
            {abi.map((el, i) => {
              if (el.type === "function") {
                return (
                  <UnstyledButton
                    style={{
                      borderRadius: 0,
                      backgroundColor:
                        i === selectedFunction
                          ? "var(--bg-highest)"
                          : "transparent",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontWeight: 400,
                    }}
                    onClick={() => setSelectedFunction(i)}
                  >
                    <span
                      style={{
                        textAlign: "left",
                        width: "100%",
                      }}
                    >
                      {el.name}
                    </span>
                    {generalStateMutability(el.stateMutability) === "write" ? (
                      <Edit2 size={12} />
                    ) : (
                      <Eye size={12} />
                    )}
                  </UnstyledButton>
                );
              }
            })}
          </VStack>
          <FunctionUI
            onResult={(val) =>
              setLastResults({ ...lastResults, [selectedFunction]: val })
            }
            lastResult={lastResults[selectedFunction]}
            chainIsActive={chainIsActive}
            chainId={chainId}
            contract={contractReadWrite}
            {...abi[selectedFunction]}
          />
        </HStack>
      ) : null}
      {isOpen && (
        <HStack style={{opacity: 0.5}}>
          <OutlinedButton
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              cursor: "pointer",
              flex: 1,
              margin: 4,
              minWidth: 0,
            }}
            onClick={() => copy(address)}
            aria-label="Copy wallet address"
            data-microtip-position="bottom"
            role="tooltip"
          >
            {" "}
            <span
              style={{
                fontFamily: "var(--font-family-code)",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {address}
            </span>
          </OutlinedButton>
          <OutlinedButton
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              cursor: "pointer",
              margin: 4,
            }}
            onClick={() => copy(JSON.stringify(abi))}
            aria-label="Copy ABI"
            data-microtip-position="bottom"
            role="tooltip"
          >
            {" "}
            <span
              style={{
                fontFamily: "var(--font-family-code)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "80px",
              }}
            >
                Copy ABI
            </span>
          </OutlinedButton>
        </HStack>
      )}
    </VStack>
  );
}

const RESULT_TYPE = {
  OUTPUT: "OUTPUT",
  ERROR: "ERROR",
};

function FunctionUI({
  lastResult,
  onResult,
  onError,
  contract,
  name,
  inputs,
  outputs,
  stateMutability,
  chainIsActive,
  chainId,
}) {
  const [result, setResult] = useState(null);
  const { watch, isRunning, error } = useAsyncStatus();
  const chainData = chainById(chainId);

  function execute(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    console.log(data);
    let exec;
    if (data.get("__value")) {
      const value = ethers.utils.parseEther(data.get("__value") || "0");
      data.delete("__value");

      exec = contract[name](...data.values(), { value });
    } else {
      exec = contract[name](...data.values());
    }
    watch(exec).then((val) => {
      setResult(val);
      onResult({ type: RESULT_TYPE.OUTPUT, val });
    });
  }

  // Bubble up errors
  React.useEffect(() => {
    if (error) {
      onResult({ type: RESULT_TYPE.ERROR, val: error });
    }
  }, [error]);

  const generalState = generalStateMutability(stateMutability);

  // Takes the last result for this given function and formats it to render.
  const formattedResult = () => {
    if (!isRunning && lastResult) {
      if (lastResult.type === RESULT_TYPE.ERROR) {
        return (
          <span
            style={{
              color: "var(--accent-negative-default)",
              wordWrap: "break-word",
            }}
          >
            {typeof lastResult.val === "object" ? (
              <pre>{JSON.stringify(lastResult.val, null, 4)}</pre>
            ) : (
              lastResult.val.toString()
            )}
          </span>
        );
      } else if (lastResult.val.hash) {
        return (
          <VStack style={{ display: "inline-flex", width: "100%" }}>
            <span style={{ color: "var(--fg-dimmer)" }}>Transaction hash</span>
            <span
              onClick={() => copy(lastResult.val.hash)}
              style={{
                display: "inline-block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                cursor: "pointer",
                width: "100%",
                whiteSpace: "nowrap",
              }}
            >
              {lastResult.val.hash}
            </span>
          </VStack>
        );
      }

      return (
        <span
          style={{ cursor: "pointer" }}
          onClick={() => copy(lastResult.val.toString())}
        >
          {lastResult.val.toString()}
        </span>
      );
    }
  };

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 2,
        overflow: "hidden",
        padding: "var(--space-8)",
        backgroundColor: "var(--bg-highest)",
      }}
      onSubmit={execute}
    >
      <VStack
        style={{
          width: "100%",
          gap: 4,
          paddingBottom: "var(--space-16)",
        }}
      >
        <HStack
          style={{
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
          }}
        >
          {/* RUN BUTTON */}
          <button
            disabled={!chainIsActive}
            className="run-button primary"
            type="submit"
            style={{
              gap: 4,
              whiteSpace: "nowrap",
              width: "64px",
              cursor: chainIsActive ? "pointer" : "not-allowed",
            }}
            aria-label={
              chainIsActive
                ? null
                : `Switch to ${chainData.name} to run this function`
            }
            data-microtip-position="bottom-right"
            role="tooltip"
            data-microtip-size="medium"
          >
            <Play size={16} />
            Run
          </button>

          {/* FUNCTION STATE EXPLANATION */}
          <span
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              whiteSpace: "nowrap",
              gap: 4,
            }}
          >
            {generalState === "write" ? <Edit2 size={12} /> : <Eye size={12} />}
            <span className="function-state-text">{generalState} • </span>
            <span className="function-state-text" style={{ opacity: 0.5 }}>
              {stateMutability}
            </span>
            <HelpIndicator
              text={mutabilityStateDescriptions[stateMutability]}
              pos="bottom-left"
            />
          </span>
        </HStack>
        {stateMutability === "nonpayable" ? (
          <HStack style={{ padding: 4, gap: 4, alignItems: "center" }}>
            <span
              style={{
                fontSize: "var(--font-size-default)",
                color: "var(--accent-warning-default)",
              }}
            >
              Requires gas
            </span>
            <HelpIndicator text="Gas is ETH you pay to execute a transaction" />
          </HStack>
        ) : null}
        {!chainIsActive ? (
          <a
            style={{ cursor: "pointer" }}
            onClick={() => switchToChain(chainId)}
          >
            Switch to {chainData.name}
          </a>
        ) : null}
      </VStack>

      {/* INPUTS */}
      <VStack style={{ padding: 4 }}>
        <VStack style={{ gap: "var(--space-8)" }}>
          {inputs.length > 0 ? (
            inputs.map((input) => {
              // check if it's a named parameter.
              const inputName = input.name !== "" ? input.name : "Input";
              return (
                <VStack style={{ gap: 4 }}>
                  {/* input name / title */}
                  <HStack style={{ gap: 4, alignItems: "center" }}>
                    <span style={{ fontWeight: 500 }}>{`${inputName}:`}</span>
                    <span
                      style={{ color: "var(--fg-dimmer)" }}
                    >{`${input.type}`}</span>
                  </HStack>
                  {/* actual input */}
                  <input
                    type="text"
                    name={inputName}
                    placeholder={`Enter a value for ${inputName}`}
                  />
                </VStack>
              );
            })
          ) : (
            <span style={{ color: "var(--fg-dimmest)" }}>No inputs</span>
          )}
          {stateMutability === "payable" && (
            <input
              type="text"
              name="__value"
              placeholder="amount of Ether to pay"
            />
          )}
        </VStack>

        <Divider />

        {/* OUTPUT */}
        <VStack style={{ gap: 4 }}>
          <span style={{ fontWeight: 500 }}>Last Output</span>

          <div
            style={{
              width: "100%",
              overflow: "scroll-y",
              padding: "var(--space-8)",
              borderRadius: "var(--br-8)",
              border: "1px solid var(--outline-default)",
            }}
          >
            {lastResult ? (
              <VStack>
                {isRunning && <span>Running</span>}
                {formattedResult()}
              </VStack>
            ) : (
              <span style={{ color: "var(--fg-dimmer)" }}>
                Output will appear here after running
              </span>
            )}
          </div>
        </VStack>
      </VStack>
    </form>
  );
}

// To detect MetaMask was installed
function ReloadOnRefocus() {
  useEffect(() => {
    const onchange = (e) => {
      if (!document.hidden) {
        location.reload();
      }
    };
    document.addEventListener("visibilitychange", onchange);
    return () => document.removeEventListener("visibilitychange", onchange);
  }, []);
  return null;
}

function useWalletAddress() {
  const { ethereum } = window;
  const [address, setAddress] = useState(ethereum && ethereum.selectedAddress);

  useEffect(() => {
    const onAddressChanged = (addresses) => setAddress(addresses[0]);
    ethereum && ethereum.on("accountsChanged", onAddressChanged);
    return () => {
      ethereum && ethereum.removeListener("accountsChanged", onAddressChanged);
    };
  }, []);

  return address;
}

function useBalance(address, chainId) {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    let fetchedBalance = setBalance;
    function check() {
      const provider = new ethers.providers.Web3Provider(ethereum);
      provider.getBalance(address).then(fetchedBalance);
    }
    check();
    const interval = setInterval(check, 1000);
    return () => {
      clearInterval(interval);
      fetchedBalance = null;
    };
  }, [address, chainId]);

  return balance;
}

function useChainId() {
  const { ethereum } = window;
  const [chainId, setChainId] = useState((ethereum && ethereum.chainId) || "1");

  useEffect(() => {
    ethereum && ethereum.on("chainChanged", setChainId);
    return () => {
      ethereum && ethereum.removeListener("chainChanged", setChainId);
    };
  }, []);

  return parseInt(chainId);
}

function useAsyncStatus() {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);

  const watch = useCallback((promise) => {
    setIsRunning(true);
    setError(null);

    return promise.then(
      (result) => {
        setIsRunning(false);
        return result;
      },
      (err) => {
        setError(err);
        setIsRunning(false);
        throw err;
      }
    );
  }, []);

  return { watch, isRunning, error };
}

function chainById(id) {
  if (id === REPLIT_CHAIN_ID) {
    return {
      name: "Replit Testnet",
      faucets: ["https://testnet.util.repl.co/"],
    };
  }
  try {
    return getChainByChainId(id);
  } catch (error) {
    return {
      name: `Chain ${id}`,
      faucets: [],
    };
  }
}

function useReplitDBStorage(key, def) {
  const [state, setState] = useState(def);

  async function load() {
    const response = await fetch("/contracts");
    const value = await response.json().catch(() => null);
    if (value) {
      setState(value);
    }
  }

  async function save(value) {
    await fetch("/contracts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });
  }

  useEffect(() => {
    load();
  }, []);

  const setStateAndUpdateDB = useCallback((value) => {
    setState(value);
    save(value);
  }, []);

  return [state, setStateAndUpdateDB];
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);