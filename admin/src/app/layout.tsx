export const metadata = {
  title: "Horse Admin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ padding: 20, fontFamily: "sans-serif" }}>{children}</body>
    </html>
  );
}
