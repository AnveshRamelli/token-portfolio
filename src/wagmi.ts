import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "token-portfolio",
  projectId: "7aa51faee6116a571448b7bacd0cded1",
  chains: [mainnet, polygon, optimism, arbitrum, base],
});
