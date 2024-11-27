import { defineEventHandler, readMultipartFormData } from 'h3';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export default defineEventHandler(async (event) => {
  try {
    const files = await readMultipartFormData(event);
    
    if (!files || files.length === 0) {
      throw new Error('No files uploaded');
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const results = [];

    for (const file of files) {
      if (file.filename) {
        const filePath = join(uploadDir, file.filename);
        await writeFile(filePath, file.data);
        results.push({
          filename: file.filename,
          path: `/uploads/${file.filename}`
        });
      }
    }

    return {
      success: true,
      files: results
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});
