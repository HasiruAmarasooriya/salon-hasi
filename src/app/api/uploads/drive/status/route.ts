import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import {
  GOOGLE_DRIVE_FOLDER_ID,
  isDriveConfigured,
} from "@/lib/google-drive/config";

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;

  let serviceAccountEmail: string | null = null;
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON) as {
        client_email?: string;
      };
      serviceAccountEmail = creds.client_email ?? null;
    } catch {
      serviceAccountEmail = null;
    }
  }

  return NextResponse.json({
    configured: isDriveConfigured(),
    folderId: GOOGLE_DRIVE_FOLDER_ID,
    serviceAccountEmail,
    folderUrl: `https://drive.google.com/drive/folders/${GOOGLE_DRIVE_FOLDER_ID}`,
  });
}
