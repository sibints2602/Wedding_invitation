import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Noto_Serif_Kannada, Noto_Serif_Malayalam, Pinyon_Script } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/lib/i18n";
import { wedding } from "@/content/wedding";

/* Two faces per language (see the type system in globals.css): Pinyon Script for names and Cormorant
   Garamond for everything else in English; Noto Serif Malayalam / Kannada for everything in those languages. */
const pinyon = Pinyon_Script({ weight: "400", subsets: ["latin"], variable: "--font-pinyon", display: "swap" });
const cormorant = Cormorant_Garamond({ weight: "variable", style: ["normal", "italic"], subsets: ["latin"], variable: "--font-cormorant", display: "swap" });
const notoMl = Noto_Serif_Malayalam({ weight: "variable", subsets: ["malayalam"], variable: "--font-noto-ml", display: "swap" });
const notoKn = Noto_Serif_Kannada({ weight: "variable", subsets: ["kannada"], variable: "--font-noto-kn", display: "swap" });

const title = `${wedding.couple.bride.firstName.en} & ${wedding.couple.groom.firstName.en} — Engagement Invitation`;
const description = `You are warmly invited to the Engagement of ${wedding.couple.bride.fullName.en} and ${wedding.couple.groom.fullName.en}, ${wedding.ceremony.church.en}, ${wedding.ceremony.city.en}.`;

export const metadata: Metadata = {
  metadataBase: new URL(wedding.siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: title }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og.jpg"] },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#6f9196",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${pinyon.variable} ${cormorant.variable} ${notoMl.variable} ${notoKn.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
