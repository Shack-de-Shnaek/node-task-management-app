import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { writeFile, readFile } from 'fs';
import { join } from 'path';

@Injectable()
export class ImagesService {
    async generateThumbnailFile(imageString: string) {
        const [dataType, data] = imageString.split(';base64,');
        const extension = dataType.split('/')[1];
        const imagePath = `/static/thumbnails/${randomUUID()}.${extension}`;
        try {
            await writeFile(join(__dirname, '..', '..', '..', imagePath), data, 'base64', (err) => {
                if (err) console.log(err);
            });
            return imagePath;
        } catch {
            return null;
        }
    }
}
