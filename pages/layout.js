export default function RootLayout({ children }) {
  return (
    <html>
      <body style={{
        margin:0,
        fontFamily:"sans-serif",
        background:"linear-gradient(135deg,#0f172a,#1e3a8a)",
        color:"white"
      }}>
        {children}
      </body>
    </html>
  );
}
