import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import { LoggingService } from '../../logging/logging.service';

@Injectable()
export class CloudinaryUtil {
  private readonly baseFolderPath: string;

  constructor(private readonly loggerService: LoggingService) {
    const cloudName = process.env.CLOUD_NAME;
    const apiKey = process.env.API_KEY;
    const apiSecret = process.env.API_SECRET_KEY;
    const baseFolderPath = process.env.BASE_FOLDER_PATH;

    if (!cloudName || !apiKey || !apiSecret || !baseFolderPath) {
      throw new Error('Missing Cloudinary configuration');
    }

    this.baseFolderPath = baseFolderPath;

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  /**
   * Uploads a file to Cloudinary using multer's file buffer
   * @param file Express.Multer.File
   * @param folderName Subfolder under base folder path
   * @param externalName Optional custom filename
   */
  async uploadSingleFileToCloudinary(
    file: Express.Multer.File,
    folderName: string,
    externalName?: string,
  ): Promise<UploadApiResponse & { fileName: string; fullUrl: string }> {
    const mimeType = file.mimetype;
    const imageName = externalName || uuidv4();
    const runMode = process.env.RUN_MODE?.toLowerCase() || 'dev';

    // Full folder + filename path
    const uploadFolderName = `${this.baseFolderPath}/${runMode}/${folderName}`;
    const resourceType = mimeType === 'image/svg+xml' ? 'raw' : 'image';

    const uploadOptions: any = {
      resource_type: resourceType,
      folder: uploadFolderName,
      public_id: imageName,
    };

    // Special handling for SVGs
    if (mimeType === 'image/svg+xml') {
      uploadOptions.format = 'svg';
      uploadOptions.type = 'authenticated';
    }

    return await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result: UploadApiResponse) => {
          if (error) return reject(error);

          const extension = result.secure_url.split('.').pop() || 'jpg';
          const fileName = `${result.public_id}.${extension}`;
          resolve({ ...result, fileName, fullUrl: result.secure_url });
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  async unlinkFileFromCloudinary(fileName: string) {
    // Split the URL into segments
    const segments = fileName.split('/');
    // Get the last three segments
    const lastThreeSegments = segments.slice(-4);
    // Join the last three segments back together
    const publicId = lastThreeSegments.join('/').split('.')[0];
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          this.loggerService.error({ error });
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
}
