import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.imperialcabs.nl"),

  title: {
    default: "Imperial Cabs B.V. | Taxi Fleet Management Amsterdam",
    template: "%s | Imperial Cabs B.V.",
  },

  description:
    "Imperial Cabs B.V. biedt professionele elektrische taxi-auto's en ondersteuning voor chauffeurs in Amsterdam & omgeving.",

  keywords: [
    "Imperial Cabs",
    "taxi fleet management",
    "taxi chauffeur Amsterdam",
    "elektrische taxi Amsterdam",
    "taxi wagenpark Amsterdam",
  ],

  authors: [{ name: "Imperial Cabs B.V." }],
  creator: "Imperial Cabs B.V.",
  publisher: "Imperial Cabs B.V.",

  alternates: {
    canonical: "https://www.imperialcabs.nl",
  },

  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://www.imperialcabs.nl",
    siteName: "Imperial Cabs B.V.",
    title: "Imperial Cabs B.V. | Taxi Fleet Management Amsterdam",
    description:
      "Professionele elektrische taxi-auto's en ondersteuning voor chauffeurs in Amsterdam & omgeving.",
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/imperial-cabs-favicon.png",
    shortcut: "/imperial-cabs-favicon.png",
    apple: "/imperial-cabs-favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
