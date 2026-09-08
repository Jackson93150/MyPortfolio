import { Michroma, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./ui/smooth-scroll";
import ScrollReveal from "./ui/scroll-reveal";
import ScrollScenes from "./ui/scroll-scenes";
import SiteNav from "./ui/site-nav";

const michroma = Michroma({
  variable: "--font-michroma",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata = {
  title: "Jackson Anthonipillai — Développeur fullstack",
  description:
    "Développeur fullstack basé à Paris. Node, Go, React, Next.js — API, interface, temps réel et 3D.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      className={`${michroma.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* set before first paint so revealed elements never flash in */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.setAttribute('data-fx','on');",
          }}
        />
      </head>
      <body className="antialiased">
        <SmoothScroll />
        <ScrollReveal />
        <ScrollScenes />
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
