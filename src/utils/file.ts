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
