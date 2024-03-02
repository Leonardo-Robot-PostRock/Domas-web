import sharp from 'sharp';

export async function processImage(file: string): Promise<string> {
  // Extract the base64 content of the image and process it with sharp
  const img = Buffer.from(file, 'base64');
  const processedData = await sharp(img).resize({ width: 200, height: 200 }).toFormat('jpeg').toBuffer();
  return processedData.toString('base64');
}
