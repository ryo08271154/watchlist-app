import { Directory, File, Paths } from "expo-file-system";

export async function saveFile(
  filename: string,
  content: string,
): Promise<File> {
  const file = new File(Paths.document, filename);

  file.create({ overwrite: true });

  await file.write(content);

  return file;
}

export async function getFile(filename: string): Promise<string> {
  const file = new File(Paths.document, filename);
  return await file.text();
}

export async function deleteFile(filename: string) {
  const file = new File(Paths.document, filename);

  if (file.exists) {
    file.delete();
  }
}

export async function downloadFile(
  filename: string,
  url: string,
): Promise<File> {
  const destination = new Directory(Paths.document, "downloads");
  destination.create({
    intermediates: true,
    idempotent: true,
  });
  const response = await fetch(url);
  return await saveFile(`downloads/${filename}`, await response.text());
}
