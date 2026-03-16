export function formatFileSize(fileSizeBytes?: number): string {
    if (!fileSizeBytes || fileSizeBytes <= 0) {
        return "-";
    }

    const units = ["B", "KB", "MB", "GB", "TB"];
    const exponent = Math.min(Math.floor(Math.log(fileSizeBytes) / Math.log(1024)), units.length - 1);
    const value = fileSizeBytes / Math.pow(1024, exponent);
    const fractionDigits = exponent === 0 ? 0 : 1;

    return `${value.toFixed(fractionDigits)} ${units[exponent]}`;
}
