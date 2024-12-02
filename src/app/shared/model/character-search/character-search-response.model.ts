import { MarvelPaginatedResource } from '../common/marvel-paginated-resource.model';
import { MarvelResource } from '../common/marvel-resource.model';
import { MarvelImage } from '../common/marvel-thumbnail.model';
import { MarvelURL } from '../common/marvel-url.model';

export interface CharacterSearchResponse {
  code: number;
  status: string;
  copyright: string;
  attributionText: string;
  attributionHTML: string;
  etag: string;
  data: CharacterSearchResponseData;
}
export interface CharacterSearchResponseData {
  offset: number;
  limit: number;
  total: number;
  count: number;
  results: Character[];
}

export interface Character {
  id: number;
  name: string;
  description: string;
  modified: Date;
  resourceURI: string;
  urls: MarvelURL[];
  thumbnail: MarvelImage;
  comics: MarvelPaginatedResource;
  stories: MarvelPaginatedResource;
  events: MarvelPaginatedResource;
  series: MarvelPaginatedResource;
}

