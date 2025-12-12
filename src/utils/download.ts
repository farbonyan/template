export const download = (url: string, filename = "file") => {
  const el = document.createElement("a");
  el.href = url;
  el.download = filename;
  el.style.display = "none";

  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
};
