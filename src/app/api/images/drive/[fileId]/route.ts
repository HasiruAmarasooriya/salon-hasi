import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { isDriveConfigured } from "@/lib/google-drive/config";
import { getDriveFileStream } from "@/lib/google-drive/client";

type Params = { params: Promise<{ fileId: string }> };

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: Params) {
  const { fileId } = await params;

  if (!fileId || !/^[a-zA-Z0-9_-]+$/.test(fileId)) {
    return NextResponse.json({ error: "Invalid file id" }, { status: 400 });
  }

  if (!isDriveConfigured()) {
    return NextResponse.json(
      { error: "Google Drive is not configured" },
      { status: 503 },
    );
  }

  try {
    const { stream, mimeType } = await getDriveFileStream(fileId);
    const webStream = Readable.toWeb(stream) as ReadableStream;

    return new NextResponse(webStream, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err) {
    console.error("Drive image proxy error:", err);
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}
