import path from 'path';
import fs from 'fs';
import { UploadedFile } from 'express-fileupload';
import { UuidAdapter } from '../../config';
import { CustomError } from '../../domain';

export class FileUploadService {
  constructor(private readonly uuid = UuidAdapter.v4) {}

  private checkFolder(folderPath: string) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  }

  async uploadSingleFile(
    file: UploadedFile,
    folderPath: string = 'uploads',
    validationExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif']
  ) {
    try {
      const fileExtension = file.mimetype.split('/')[1] ?? '';

      if (!validationExtensions.includes(fileExtension)) {
        throw CustomError.badRequest(`Invalid file extension: ${fileExtension}, valid extensions: ${validationExtensions}`);
      }
      
      const destination = path.resolve(__dirname, `../../../${folderPath}`);
      this.checkFolder(destination);

      const fileName = `${this.uuid()}.${fileExtension}`;

      file.mv(`${destination}/${fileName}`);

      return { fileName };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async uploadMultipleFiles(
    files: UploadedFile[],
    folderPath: string = 'uploads',
    validationExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif']
  ) {

    const fileNames = await Promise.all(
      files.map(async file => await this.uploadSingleFile(file, folderPath, validationExtensions))
    );

    return fileNames;
  }
}
