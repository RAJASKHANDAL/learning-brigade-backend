import { randomUUID } from "crypto";
import admin from "../config/firebaseAdmin";

interface UploadOptions {
  folder: "notes" | "profile-images";
  originalName: string;
  buffer: Buffer;
  contentType: string;
}

export async function uploadToStorage({
  folder,
  originalName,
  buffer,
  contentType,
}: UploadOptions): Promise<string> {
  const bucket = admin.storage().bucket();
  const objectPath = `${folder}/${randomUUID()}-${originalName}`;
  const file = bucket.file(objectPath);

  await file.save(buffer, { contentType });
  await file.makePublic();

  return `https://storage.googleapis.com/${bucket.name}/${objectPath}`;
}

export async function deleteFromStorage(fileURL: string): Promise<void> {
  const bucket = admin.storage().bucket();
  const prefix = `https://storage.googleapis.com/${bucket.name}/`;

  if (!fileURL.startsWith(prefix)) return;

  const objectPath = fileURL.slice(prefix.length);

  try {
    await bucket.file(objectPath).delete();
  } catch (err) {
    console.error("Failed to delete storage object:", err);
  }
}
