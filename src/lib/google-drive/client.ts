import { readFileSync } from "node:fs";
import { Readable } from "node:stream";
import { google } from "googleapis";
import {
  GOOGLE_DRIVE_FOLDER_ID,
  isDriveConfigured,
} from "@/lib/google-drive/config";
import { driveProxyImageUrl, drivePublicViewUrl } from "@/lib/google-drive/urls";

function loadServiceAccountCredentials(): Record<string, unknown> {
  const jsonEnv = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (jsonEnv) {
    return JSON.parse(jsonEnv) as Record<string, unknown>;
  }

  const path = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (path) {
    return JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;
  }

  throw new Error(
    "Google Drive is not configured. Set GOOGLE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS.",
  );
}

export function getDriveClient() {
  if (!isDriveConfigured()) {
    throw new Error("Google Drive credentials are missing.");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: loadServiceAccountCredentials(),
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });

  return google.drive({ version: "v3", auth });
}

export async function uploadImageToDrive(
  buffer: Buffer,
  mimeType: string,
  fileName: string,
) {
  const drive = getDriveClient();

  const created = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [GOOGLE_DRIVE_FOLDER_ID],
    },
    media: {
      mimeType,
      body: Readable.from(buffer),
    },
    fields: "id, name, mimeType",
  });

  const fileId = created.data.id;
  if (!fileId) {
    throw new Error("Google Drive did not return a file id.");
  }

  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  return {
    fileId,
    imageUrl: driveProxyImageUrl(fileId),
    publicUrl: drivePublicViewUrl(fileId),
  };
}

export async function deleteDriveFile(fileId: string) {
  const drive = getDriveClient();
  await drive.files.delete({ fileId });
}

export async function getDriveFileStream(fileId: string) {
  const drive = getDriveClient();
  const meta = await drive.files.get({
    fileId,
    fields: "mimeType, name",
  });

  const media = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "stream" },
  );

  return {
    stream: media.data as Readable,
    mimeType: meta.data.mimeType ?? "application/octet-stream",
  };
}
