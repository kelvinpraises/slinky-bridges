"use client";

import Background from "@/components/Background";
import { AlgorandWalletProvider } from "@/contexts/AlgorandWalletContext";
import { EthereumWalletProvider } from "@/contexts/EthereumWalletContext";
import { SolanaWalletProvider } from "@/contexts/SolanaWalletContext";
import GlobalStyles from "@/styles/globalStyle";
import StyledComponentsRegistry from "./registry";
import { SSRProvider } from "react-aria";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrappedChildren = (
    <div style={{ position: "relative", zIndex: "1" }}>{children}</div>
  );

  return (
    <html lang="en">
      <head />
      <StyledComponentsRegistry>
        <AlgorandWalletProvider>
          <EthereumWalletProvider>
            <SolanaWalletProvider>
              <SSRProvider>
                <GlobalStyles />
                <body>
                  {wrappedChildren}
                  <Background />
                </body>
              </SSRProvider>
            </SolanaWalletProvider>
          </EthereumWalletProvider>
        </AlgorandWalletProvider>
      </StyledComponentsRegistry>
    </html>
  );
}
