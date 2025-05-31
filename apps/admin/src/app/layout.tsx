import Link from "next/link";

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
      <body style={{ padding: 20, fontFamily: "sans-serif" }}>
        <nav style={{ marginBottom: 20 }}>
          <Link href="/">🏠 Home</Link> | <Link href="/horse">🐎 Horse</Link> |{" "}
          <Link href="/race-flow">📊 Race Flow</Link> |{" "}
          <Link href="/bet-flow">📊 Bet Flow</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
