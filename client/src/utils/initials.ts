/**
 * Checks if a character is a non-Latin character
 * Returns true for any character that is not a basic Latin letter (A-Z, a-z)
 * This supports all non-Latin scripts including Asian, Cyrillic, Arabic, Hebrew, etc.
 */
function isNonLatinCharacter(char: string): boolean {
  const code = char.charCodeAt(0);
  // Basic Latin letters: A-Z (U+0041-U+005A) and a-z (U+0061-U+007A)
  return !((code >= 0x0041 && code <= 0x005A) || (code >= 0x0061 && code <= 0x007A));
}

/**
 * Generates initials from a name
 * - Single name: first letter
 * - Two or more names: first letter of first name + first letter of last name
 * - Non-Latin characters: first character only (supports all non-Latin scripts)
 */
export function getInitials(name: string): string {
  if (!name || !name.trim()) {
    return '?';
  }

  const trimmedName = name.trim();
  
  if (trimmedName.length === 0) {
    return '?';
  }

  // Check if the first character is non-Latin - if so, use only that character
  const firstChar = trimmedName[0];
  if (isNonLatinCharacter(firstChar)) {
    return firstChar;
  }

  // For non-Asian names, split by spaces
  const parts = trimmedName.split(/\s+/).filter(part => part.length > 0);

  if (parts.length === 0) {
    return '?';
  }

  // Single name: use first letter
  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }

  // Two or more names: use first letter of first name + first letter of last name
  const firstName = parts[0];
  const lastName = parts[parts.length - 1];
  return (firstName[0] + lastName[0]).toUpperCase();
}

