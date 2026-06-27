import "./globals.css";

export const metadata = {
  title: "AJ Salon – Premium Beauty & Grooming",
  description: "Premium salon experience in Sri Lanka",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}