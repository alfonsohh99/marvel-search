export interface ComicSearchRequest {
  // Return only issues in series whose title starts with the input.
  titleStartsWith?: string;

  // Limit the result set to the specified number of resources
  limit?: number;

  // Skip the specified number of resources in the result set.
  offset?: number;

  // The rest of this request model has been left unmodeled due to time constraints
}
