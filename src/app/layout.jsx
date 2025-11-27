import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import AppChrome from "@/components/layout/AppChrome";
import GlobalLoading from "@/components/common/GlobalLoading";

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
          <AppChrome>{children}</AppChrome>
          <GlobalLoading />
        </Providers>
      </body>
    </html>
  );
}
