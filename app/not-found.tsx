export default function NotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white">
        <h1 className="text-4xl font-bold text-[#1a2b4a]">404</h1>
        <p className="text-gray-500">Page not found</p>
        <a href="/en" className="font-semibold text-[#c9a84c] hover:underline">
          Go Home
        </a>
      </body>
    </html>
  );
}
