import { useAppDispatch } from "../app/hooks";
import { clearAddress, setAddress } from "../features/wallet/walletSlice";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet } from "lucide-react";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export const WalletConnectButton = () => {
  const dispatch = useAppDispatch();
  const { isConnected, address } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      dispatch(setAddress(address));
    } else {
      dispatch(clearAddress());
    }
  }, [isConnected, address, dispatch]);
  return (
    <ConnectButton.Custom>
      {({ account, openConnectModal, openAccountModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account;

        return (
          <div {...(!ready && { "aria-hidden": true })}>
            {connected ? (
              <button
                onClick={openAccountModal}
                className="flex items-center gap-2 px-4 py-1 rounded-2xl bg-accent text-xs text-black cursor-pointer"
              >
                <Wallet />
                {account.displayName}
              </button>
            ) : (
              <button
                onClick={openConnectModal}
                className="flex items-center gap-2 px-4 py-1 rounded-2xl bg-accent text-black text-xs cursor-pointer"
              >
                <Wallet />
                Connect Wallet
              </button>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
