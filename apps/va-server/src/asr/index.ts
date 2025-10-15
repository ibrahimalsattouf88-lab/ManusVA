export function normalizeAr(text: string) {
  return text
    .replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString()) // تحويل للأرقام 0-9
    .replace(/\s+/g, " ")
    .trim();
}
