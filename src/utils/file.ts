/**
 * Get blob object from data url
 *
 * @param dataUrl Data url string
 * @param filename File name
 * @returns Blob of data url
 */
export const dataUrlToFile = (dataUrl: string, filename = "") => {
  const arr = dataUrl.split(",");
  const mime = /:(.*?);/.exec(arr[0]!)![1];
  const bstr = atob(arr[arr.length - 1]!);
  const u8arr = new Uint8Array(bstr.length);
  u8arr.forEach((_, i) => (u8arr[i] = bstr.charCodeAt(i)));
  return new File([u8arr], filename, { type: mime });
};

/**
 * Get blob object to data url
 *
 * @param file File
 * @returns Data url
 */
export const fileToDataUrl = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () =>
      reject(new Error("Could not parse file to data url"));
  });
};

/**
 * Get rename filename with target extension
 *
 * @param filename Filename string with extension
 * @param extension Target extension
 * @returns New filename with extension
 */
export const changeFileExtension = (filename: string, extension: string) => {
  const pos = filename.lastIndexOf(".");
  return filename.substring(0, pos < 0 ? filename.length : pos) + extension;
};

export const documentTypes = {
  PDF: [{ type: "application/pdf", ext: ".pdf" }],

  Word: [
    { type: "application/msword", ext: ".doc" },
    {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ext: ".docx",
    },
    { type: "application/vnd.oasis.opendocument.text", ext: ".odt" },
  ],

  Excel: [
    { type: "application/vnd.ms-excel", ext: ".xls" },
    {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ext: ".xlsx",
    },
    { type: "application/vnd.oasis.opendocument.spreadsheet", ext: ".ods" },
  ],

  CSV: [{ type: "text/csv", ext: ".csv" }],

  PowerPoint: [
    { type: "application/vnd.ms-powerpoint", ext: ".ppt" },
    {
      type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ext: ".pptx",
    },
    { type: "application/vnd.oasis.opendocument.presentation", ext: ".odp" },
  ],

  PlainText: [{ type: "text/plain", ext: ".txt" }],

  Image: [
    { type: "image/jpeg", ext: ".jpg" },
    { type: "image/jpeg", ext: ".jpeg" },
    { type: "image/png", ext: ".png" },
    { type: "image/webp", ext: ".webp" },
    { type: "image/gif", ext: ".gif" },
  ],

  Zip: [{ type: "application/zip", ext: ".zip" }],

  Sound: [
    { type: "audio/mpeg", ext: ".mp3" },
    { type: "audio/wav", ext: ".wav" },
    { type: "audio/ogg", ext: ".ogg" },
    { type: "audio/mp4", ext: ".m4a" },
    { type: "audio/flac", ext: ".flac" },
  ],

  Video: [
    { type: "video/mp4", ext: ".mp4" },
    { type: "video/webm", ext: ".webm" },
    { type: "video/quicktime", ext: ".mov" },
    { type: "video/x-msvideo", ext: ".avi" },
    { type: "video/x-matroska", ext: ".mkv" },
  ],
};

export const ALLOWED_UPLOAD_DOCUMENT_TYPES = Object.values(documentTypes)
  .flat()
  .map((x) => x.type);

export const ALLOWED_UPLOAD_EXTENSIONS = Object.values(documentTypes)
  .flat()
  .map((x) => x.ext);

export const MAX_FILE_SIZE = 500 * 1024 * 1024;

export const validate = (file: File) => {
  const ext = "." + file.name.split(".").pop()?.toLowerCase();

  return (
    ALLOWED_UPLOAD_DOCUMENT_TYPES.includes(file.type) &&
    ALLOWED_UPLOAD_EXTENSIONS.includes(ext) &&
    file.size <= MAX_FILE_SIZE
  );
};
