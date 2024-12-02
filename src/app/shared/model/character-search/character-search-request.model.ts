export interface CharacterSearchRequest {
  // Return only characters matching the specified full character name (e.g. Spider-Man).
  name?: string;

  // Return characters with names that begin with the specified string (e.g. Sp).
  nameStartsWith?: string;

  // Return only characters which have been modified since the specified date.
  modifiedSince?: Date;

  // Return only characters which appear in the specified comics (accepts a comma-separated list of ids).
  comics?: number[];

  // Return only characters which appear the specified series (accepts a comma-separated list of ids).
  series?: number[];

  // Return only characters which appear in the specified events (accepts a comma-separated list of ids).
  events?: number[];

  // Return only characters which appear the specified stories (accepts a comma-separated list of ids).
  stories?: number[];

  // Order the result set by a field or fields. Add a "-" to the value sort in descending order. Multiple values are given priority in the order in which they are passed.
  orderBy?: CharacterSearchRequestOrderBy;

  // Limit the result set to the specified number of resources
  limit?: number;

  // Skip the specified number of resources in the result set.
  offset?: number;
}

export enum CharacterSearchRequestOrderBy {
  ASCENDING_NAME = 'name',
  ASCENDING_MODIFIED = 'modified',
  DESCENDING_NAME = '-name',
  DESCENDING_MODIFIED = '-modified',
}
