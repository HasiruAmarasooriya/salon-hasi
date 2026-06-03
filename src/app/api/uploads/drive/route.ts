import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import {
  ALLOWED_IMAGE_TYPES,
  isDriveConfigured,
  MAX_UPLOAD_BYTES,
} from "@/lib/google-drive/config";
import { uploadImageToDrive } from "@/lib/google-drive/client";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  if (!isDriveConfigured()) {
    return NextResponse.json(
      {
        error:
          "Google Drive is not configured. Add GOOGLE_SERVICE_ACCOUNT_JSON to .env and share your folder with the service account email.",
      },
      { status: 503 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, and GIF images are allowed" },
        { status: 400 },
      );
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: "Image must be 8 MB or smaller" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName =
      file.name.replace(/[^a-zA-Z0-9._-]/g, "_") || `upload-${Date.now()}.jpg`;

    const uploaded = await uploadImageToDrive(buffer, file.type, safeName);

    return NextResponse.json({
      success: true,
      fileId: uploaded.fileId,
      imageUrl: uploaded.imageUrl,
      publicUrl: uploaded.publicUrl,
    });
  } catch (err) {
    console.error("Drive upload error:", err);
    const message =
      err instanceof Error ? err.message : "Upload to Google Drive failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
