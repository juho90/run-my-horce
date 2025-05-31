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
          <Link href="/race">📊 Race</Link> |{" "}
          <Link href="/start-race">🚀 Start</Link> |{" "}
          <Link href="/stop-race">🛑 Stop</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
