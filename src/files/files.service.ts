import { Injectable } from '@nestjs/common';
import { PostAttachment, TaskAttachment } from '@prisma/client';
import { randomUUID } from 'crypto';
import { writeFile, readFile } from 'fs';
import path, { join } from 'path';

@Injectable()
export class FilesService {
	constructor() {}

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

	async generateAttachmentFiles(fileStrings: string[]) {
		const attachments: { isImage: boolean; path: string }[] = [];
		for (const fileString of fileStrings) {
			const [dataType, data] = fileString.split(';base64,');
			const extension = dataType.split('/')[1];
			const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(extension);
			const filePath = `/static/attachments/${randomUUID()}.${extension}`;
			try {
				await writeFile(
					join(__dirname, '..', '..', '..', filePath),
					data,
					'base64',
					(err) => {
						if (err) console.log(err);
					},
				);
				attachments.push({
					isImage: isImage,
					path: filePath,
				});
			} catch {
				return null;
			}
		}
		return attachments;
	}
}
