import { BadRequestException } from '@nestjs/common';

export const imageFileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.match(/^image\/(jpeg|png|jpg|webp)$/)) {
    return cb(
      new BadRequestException(
        'Only image files (jpeg, png, webp) are allowed!',
      ),
      false,
    );
  }
  cb(null, true);
};
// profile image size limit
export const profileImageSizeLimit = 2 * 1024 * 1024; // 2MB
