export enum CharacterListFilterType {
  COMIC = 'comic',
  EVENT = 'event',
}

export const CHARACTER_LIST_FILTER_TYPE_NAME_MAP = {
  [CharacterListFilterType.COMIC]: 'Comic',
  [CharacterListFilterType.EVENT]: 'Event',
};

export const CHARACTER_LIST_FILTER_TYPE_ICON_MAP = {
  [CharacterListFilterType.COMIC]: 'menu_book',
  [CharacterListFilterType.EVENT]: 'celebration',
};
