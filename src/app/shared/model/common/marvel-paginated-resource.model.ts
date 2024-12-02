import { MarvelResource } from "./marvel-resource.model";

export interface MarvelPaginatedResource {
    available: number;
    returned: number;
    collectionURI: string;
    items: MarvelResource[];
  }