/**
 * Utility functions for handling images in the application
 */

/**
 * Converts a File object to base64 string for API transmission
 * @param file File to convert
 * @returns Promise that resolves to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Compresses an image to reduce file size before upload
 * @param file Image file to compress
 * @param maxWidth Maximum width in pixels
 * @param maxHeight Maximum height in pixels
 * @param quality Compression quality (0-1)
 * @returns Promise with compressed Blob
 */
export const compressImage = (
  file: File, 
  maxWidth = 1200, 
  maxHeight = 800, 
  quality = 0.7
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round(height * (maxWidth / width));
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round(width * (maxHeight / height));
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          blob => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          file.type,
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Error loading image'));
      };
    };
    
    reader.onerror = error => {
      reject(error);
    };
  });
};

/**
 * Processes an image file for API upload by compressing and converting to base64
 * @param file Image file to process
 * @returns Promise with base64 string
 */
export const processImageForUpload = async (file: File): Promise<string> => {
  try {
    // First compress the image
    const compressedBlob = await compressImage(file);
    
    // Convert compressed blob to File object
    const compressedFile = new File([compressedBlob], file.name, { 
      type: file.type 
    });
    
    // Convert to base64
    return await fileToBase64(compressedFile);
  } catch (error) {
    console.error('Error processing image:', error);
    // Fall back to uncompressed conversion if compression fails
    return await fileToBase64(file);
  }
};

/**
 * Validates image file type and size
 * @param file File to validate
 * @param maxSizeMB Maximum file size in MB
 * @returns Error message or null if valid
 */
export const validateImage = (file: File, maxSizeMB = 5): string | null => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return 'File must be an image';
  }
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `Image must be smaller than ${maxSizeMB}MB`;
  }
  
  return null;
};

/**
 * Renders image from string or File for display
 * @param image Image source (base64 string or File)
 * @returns URL for display
 */
export const renderImageSource = (image: string | File | undefined): string => {
  if (!image) return '';
  
  if (typeof image === 'string') {
    return image;
  } else {
    return URL.createObjectURL(image);
  }
}; 