import Providers from "@/components/Providers";
import "../globals.css";
import Script from "next/script";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="lazyOnload"
          />
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
