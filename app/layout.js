export const metadata = {
  title: 'Talking Objects',
  description: 'Create interactive AI agents that engage with the real world',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: 'black', color: 'white' }}>
        {children}
      </body>
    </html>
  );
}