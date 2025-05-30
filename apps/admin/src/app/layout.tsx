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
          <a href="/">🏠 Home</a> | <a href="/horses">🐎 Horses</a> |{" "}
          <a href="/start-race">🚀 Start</a> | <a href="/stop-race">🛑 Stop</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
