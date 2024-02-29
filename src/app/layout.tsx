import ContextProviders from "@/contexts";
import { Flowbite, ThemeModeScript } from "flowbite-react";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { type FC, type PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import "./globals.css";
import { flowbiteTheme } from "./theme";

const inter = Inter({ subsets: ["latin"] });

const RootLayout: FC<PropsWithChildren> = function ({ children }) {
  return (
    <html lang="en">
      <head>
        <ThemeModeScript />
      </head>
      <body
        className={twMerge("bg-slate-50 dark:bg-slate-900", inter.className)}
      >
        <NextTopLoader
          color="#2299DD"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2299DD,0 0 5px #2299DD"
        />
        <Flowbite theme={{ theme: flowbiteTheme }}>
          <ContextProviders>{children}</ContextProviders>
        </Flowbite>
      </body>
    </html>
  );
};

export default RootLayout;
