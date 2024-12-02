import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { AsyncPipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  HostBinding,
  inject,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { map, Observable } from 'rxjs';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';
import { CharacterService } from '../services/character.service';
import { InifityScrollDatasource } from '../shared/infinity-scroll-datasource/infinity-scroll-datasource';
import {
  CHARACTER_LIST_FILTER_TYPE_ICON_MAP,
  CHARACTER_LIST_FILTER_TYPE_NAME_MAP,
  CharacterListFilterType,
} from '../shared/model/character-filter.enum';
import { Character } from '../shared/model/character-search/character-search-response.model';
import { ChipItem } from '../shared/model/chip-item.model';
import { ExtendedChipItem } from '../shared/model/extended-chip-item.model';

@Component({
  selector: 'app-character-list',
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatChipsModule,
    MatDialogModule,
    ScrollingModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    AsyncPipe,
  ],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.scss',
})
export class CharacterListComponent {
  @ViewChild(CdkVirtualScrollViewport)
  cdkVirtualScrollViewport: CdkVirtualScrollViewport | undefined;

  nameFormControl: FormControl<string>;

  infinityScrollDatasource: InifityScrollDatasource<Character> | undefined;

  viewHeight = window.visualViewport?.height ?? 800;

  pageSize = 100;

  query: { nameStartsWith: string | undefined } = {
    nameStartsWith: undefined,
  };

  selectedFilters: ExtendedChipItem[] = [];

  characterListFilterTypeNameMap = CHARACTER_LIST_FILTER_TYPE_NAME_MAP;

  characterListFilterTypeIconMap = CHARACTER_LIST_FILTER_TYPE_ICON_MAP;

  destroyRef = inject(DestroyRef);

  constructor(
    private readonly characterService: CharacterService,
    private readonly matDialog: MatDialog
  ) {
    this.nameFormControl = new FormControl<string>('', { nonNullable: true });
  }

  onSearch(): void {
    this.query = {
      nameStartsWith: this.nameFormControl.value,
    };
    if (!this.infinityScrollDatasource) {
      this.infinityScrollDatasource = new InifityScrollDatasource<Character>(
        this.pageSize,
        this.fetchPage.bind(this),
        (() => this.cdkVirtualScrollViewport?.scrollToIndex(0)).bind(this)
      );
    } else {
      this.infinityScrollDatasource.reset();
    }
  }

  fetchPage(page: number): Observable<Character[]> {
    const nameStartsWith = this.query.nameStartsWith;

    return this.characterService
      .searchCharacters({
        offset: this.pageSize * page,
        limit: this.pageSize,
        nameStartsWith,
        comics: this.selectedFilters
          .filter(
            (selectedFilter) =>
              selectedFilter.type === CharacterListFilterType.COMIC
          )
          .map((comic) => comic.id),
        events: this.selectedFilters
          .filter(
            (selectedFilter) =>
              selectedFilter.type === CharacterListFilterType.EVENT
          )
          .map((event) => event.id),
      })
      .pipe(map((response) => response.data.results));
  }

  onClearFilters(): void {
    this.selectedFilters = [];
  }

  onOpenComicFilterModal(): void {
    this.openFilterModal(CharacterListFilterType.COMIC);
  }

  onOpenEventFilterModal(): void {
    this.openFilterModal(CharacterListFilterType.EVENT);
  }

  openFilterModal(filterType: CharacterListFilterType): void {
    this.matDialog
      .open(FilterModalComponent, {
        data: { filterType },
        minWidth: '900px',
        disableClose: true,
      })
      .afterClosed()
      .subscribe((newChips: ChipItem[]) => {
        if (!newChips?.length) {
          return;
        }
        const newChipsFiltered = newChips.filter(
          (newChip) =>
            !this.selectedFilters.find(
              (currentChip) => currentChip.id === newChip.id
            )
        );

        this.selectedFilters.push(
          ...newChipsFiltered.map(
            (newChip) => ({ ...newChip, type: filterType } as ExtendedChipItem)
          )
        );
      });
  }

  onChipRemove(i: number): void {
    this.selectedFilters.splice(i, 1);
  }
}
