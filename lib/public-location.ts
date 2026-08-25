/**
 * Helpers for stripping non-public fields from location records
 *
 * Location addresses are internal only. They are entered and edited in the
 * admin area, but must never reach a public page or API response — hiding the
 * field in the UI is not enough, since `select('*')` would still ship it in the
 * JSON payload where anyone can read it.
 *
 * Admin routes read from Supabase directly and are unaffected by these helpers.
 */

import type { Location } from '@/types/database';

export type PublicLocation = Omit<Location, 'address'>;

/** Remove the address from a single location record. */
export function toPublicLocation<T extends { address?: string }>(
  location: T
): Omit<T, 'address'> {
  const publicFields = { ...location };
  delete publicFields.address;
  return publicFields;
}

/** Remove the address from every location in a list. */
export function toPublicLocations<T extends { address?: string }>(
  locations: T[]
): Omit<T, 'address'>[] {
  return locations.map(toPublicLocation);
}
