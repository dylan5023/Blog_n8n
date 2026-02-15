export async function GET() {
  const content = "google.com, pub-3632247310129820, DIRECT, f08c47fec0942fa0";

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
