import { CharacterListFilterType } from './character-filter.enum';
import { ChipItem } from './chip-item.model';

export interface ExtendedChipItem extends ChipItem {
  type: CharacterListFilterType;
}
