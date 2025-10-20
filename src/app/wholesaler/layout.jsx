import { Inter, Poppins } from "next/font/google";

import { Providers } from "@/app/providers";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Gulu - B2B Dropshipping Marketplace",
  description:
    "The leading B2B marketplace connecting wholesalers, resellers, and customers worldwide. Build your business with confidence.",
  keywords: "B2B, dropshipping, marketplace, wholesale, reseller, ecommerce",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased`}
        suppressHydrationWarning={true}
      >
        <Providers>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
