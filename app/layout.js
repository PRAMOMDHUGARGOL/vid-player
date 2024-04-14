import { Urbanist } from "next/font/google";
import "./globals.css";

const urbanist = Urbanist({ subsets: ["latin"] });

export const metadata = {
  title: "Video Player",
  description: "Making videos easier to watch",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="max-w-screen-2xl mx-auto max-h-screen">
      <body className={`${urbanist.className}`}>{children}</body>
    </html>
  );
}
