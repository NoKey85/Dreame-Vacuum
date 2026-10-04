/**
 * Helper function to check if a string is an SVG
 */
export function isSvgString(str: string): boolean {
  return typeof str === 'string' && str.trim().startsWith('<svg');
}

/**
 * Helper function to check if an icon is emoji
 */
export function isEmojiString(str: string): boolean {
  return typeof str === 'string' && !isSvgString(str);
}
