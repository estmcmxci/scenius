"use client";

import { ParaProvider as ParaSDKProvider } from "@getpara/react-sdk";
import "@getpara/react-sdk/styles.css";
import { paraClient } from "@/app/config/para";

export function ParaProvider({ children }: { children: React.ReactNode }) {
  return (
    <ParaSDKProvider
      paraClientConfig={paraClient}
      config={{ appName: "Scenius" }}
      paraModalConfig={{
        disableEmailLogin: false,
        disablePhoneLogin: true,
        authLayout: ["AUTH:FULL"],
        oAuthMethods: ["GOOGLE"],
        theme: {
          mode: "dark",
          borderRadius: "md",
          accentColor: "#6366f1",
          foregroundColor: "#e2e8f0",
          backgroundColor: "#0f172a",
        },
      }}>
      {children}
    </ParaSDKProvider>
  );
}
