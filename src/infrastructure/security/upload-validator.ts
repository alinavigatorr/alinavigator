const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const DANGEROUS_EXTENSIONS = /\.(exe|sh|bat|php|js|html|py)$/i;

export interface UploadValidationResult {
  isValid: boolean;
  error?: string;
}

export class UploadValidator {
  static validate(file: { name: string; size: number; type: string }): UploadValidationResult {
    if (DANGEROUS_EXTENSIONS.test(file.name)) {
      return { isValid: false, error: 'Dangerous file extension detected.' };
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return { isValid: false, error: 'Invalid MIME type. Only JPEG, PNG, and WebP are allowed.' };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return { isValid: false, error: 'File size exceeds the 5MB maximum limit.' };
    }

    return { isValid: true };
  }

  static sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
  }
}