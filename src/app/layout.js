import "./globals.css";
import { IBM_Plex_Sans_JP } from "next/font/google";

const ibmPlexSansJp = IBM_Plex_Sans_JP({
  weight:["400","600"],
  style:"normal",
  display:"swap",
  preload:false,
  variable:"--font-ibm-plex-jp",
  fallback:["Hiragino Sans","Yu Gothic","sans-serif"],
});

export const metadata = { title:"Ib Navigator", description:"AI travel assistant" };

export default function RootLayout({ children }) {
  return <html lang="ja" className={ibmPlexSansJp.variable}><body>{children}</body></html>;
}
