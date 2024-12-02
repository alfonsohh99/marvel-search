import { MarvelDate } from '../common/marvel-date.model';
import { MarvelPaginatedResource } from '../common/marvel-paginated-resource.model';
import { MarvelPrice } from '../common/marvel-price.model';
import { MarvelResource } from '../common/marvel-resource.model';
import { MarvelTextObject } from '../common/marvel-text-object.model';
import { MarvelImage } from '../common/marvel-thumbnail.model';
import { MarvelURL } from '../common/marvel-url.model';

export interface ComicSearchResponse {
  code: number;
  status: string;
  copyright: string;
  attributionText: string;
  attributionHTML: string;
  etag: string;
  data: ComicSearchResponseData;
}
export interface ComicSearchResponseData {
  offset: number;
  limit: number;
  total: number;
  count: number;
  results: Comic[];
}

export interface Comic {
  id: number;
  digitalId: number;
  title: string;
  resourceURI: string;
  issueNumber: number;
  variantDescription: string;
  description: string;
  modified: Date;
  isbn: string;
  upc: string;
  diamondCode: string;
  ean: string;
  issn: string;
  format: string;
  pageCount: number;
  textObjects: MarvelTextObject[];
  urls: MarvelURL[];
  stories: MarvelPaginatedResource;
  events: MarvelPaginatedResource;
  creators: MarvelPaginatedResource;

  thumbnail: MarvelImage;

  series: MarvelResource;
  variants: MarvelResource[];
  collections: MarvelResource[];
  collectedIssues: MarvelResource[];
  dates: MarvelDate[];
  prices: MarvelPrice[];
  images: MarvelImage[];
  characters: MarvelPaginatedResource;
}
