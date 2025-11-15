import { blobServiceClient } from "./app";

export async function uploadBlob(
  containerName: string,
  blobName: string,
  buffer: Buffer,
  contentType?: string
) {
  console.log(blobServiceClient.getProperties());
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists({ access: "container" });

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: contentType || "application/octet-stream",
    },
  });

  return blockBlobClient.url;
}

export async function getBlob(containerName: string, blobName: string): Promise<Buffer | null> {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);

    const exists = await blobClient.exists();
    if (!exists) {
      console.warn(`Blob "${blobName}" not found in container "${containerName}".`);
      return null;
    }

    const downloadResponse = await blobClient.download();
    const downloadedBuffer = await streamToBuffer(downloadResponse.readableStreamBody);

    return downloadedBuffer;
  } catch (error) {
    console.error(`Error getting blob "${blobName}" from container "${containerName}":`, error);
    throw error;
  }
}

async function streamToBuffer(readableStream: NodeJS.ReadableStream | null): Promise<Buffer> {
  if (!readableStream) return Buffer.alloc(0);

  const chunks: Buffer[] = [];
  for await (const chunk of readableStream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}


export async function deleteBlob(containerName: string, blobName: string): Promise<boolean> {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);

    const exists = await blobClient.exists();
    if (!exists) {
      console.warn(`Blob "${blobName}" not found in container "${containerName}".`);
      return false;
    }

    await blobClient.delete();
    console.log(`Deleted blob "${blobName}" from container "${containerName}".`);
    return true;
  } catch (error) {
    console.error(`Error deleting blob "${blobName}" from container "${containerName}":`, error);
    throw error;
  }
}

