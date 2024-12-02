import { Component, Inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  CHARACTER_LIST_FILTER_TYPE_ICON_MAP,
  CHARACTER_LIST_FILTER_TYPE_NAME_MAP,
  CharacterListFilterType,
} from '../shared/model/character-filter.enum';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { InifityScrollDatasource } from '../shared/infinity-scroll-datasource/infinity-scroll-datasource';
import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Comic } from '../shared/model/comic-search/comic-search-response.model';
import { ComicService } from '../services/comic.service';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { ChipItem } from '../shared/model/chip-item.model';
import { EventService } from '../services/event.service';
import { Event } from '../shared/model/event-search/event-search-response.model';
import { AsyncPipe } from '@angular/common';
import { MarvelError } from '../shared/model/error.model';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface FilterModalComponentData {
  filterType: CharacterListFilterType;
}

@Component({
  selector: 'app-filter-modal',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    ScrollingModule,
    MatListModule,
    MatChipsModule,
    AsyncPipe,
    MatTooltipModule
  ],
  templateUrl: './filter-modal.component.html',
  styleUrl: './filter-modal.component.scss',
})
export class FilterModalComponent {
  @ViewChild(CdkVirtualScrollViewport)
  cdkVirtualScrollViewport: CdkVirtualScrollViewport | undefined;

  searchFormcontrol: FormControl<string>;

  infinityScrollDatasource: InifityScrollDatasource<Comic | Event> | undefined;

  query: { titleStartsWith: string | undefined } = {
    titleStartsWith: undefined,
  };

  pageSize = 100;

  viewHeight = window.visualViewport?.height ?? 500;

  selectedFilters: ChipItem[] = [];
  characterListFilterTypeNameMap = CHARACTER_LIST_FILTER_TYPE_NAME_MAP;

  characterListFilterTypeIconMap = CHARACTER_LIST_FILTER_TYPE_ICON_MAP;

  fetchError: MarvelError | undefined;

  constructor(
    private readonly dialogRef: MatDialogRef<FilterModalComponent>,
    private readonly comicService: ComicService,
    private readonly eventService: EventService,
    @Inject(MAT_DIALOG_DATA) public readonly data: FilterModalComponentData
  ) {
    this.searchFormcontrol = new FormControl<string>('', { nonNullable: true });
  }

  onSearch(): void {
    this.query = {
      titleStartsWith: this.searchFormcontrol.value,
    };
    if (!this.infinityScrollDatasource) {
      this.infinityScrollDatasource = new InifityScrollDatasource<
        Comic | Event
      >(
        this.pageSize,
        this.fetchPage.bind(this),
        (() => this.cdkVirtualScrollViewport?.scrollToIndex(0)).bind(this)
      );
    } else {
      this.infinityScrollDatasource.reset();
    }
  }

  fetchPage(page: number): Observable<(Comic | Event)[]> {
    const source =
      this.data.filterType === CharacterListFilterType.COMIC
        ? this.comicService.searchComics({
            offset: this.pageSize * page,
            limit: this.pageSize,
            titleStartsWith: this.query.titleStartsWith,
          })
        : this.eventService.searchEvents({
            offset: this.pageSize * page,
            limit: this.pageSize,
            nameStartsWith: this.query.titleStartsWith,
          });
    return source.pipe(
      catchError((err) => {
        this.fetchError = { code: err.status, message: err.error.message };
        return throwError(() => err);
      }),
      map((response) => {
        this.fetchError = undefined;
        return response.data.results;
      })
    );
  }

  onItemClick(item: Comic | Event): void {
    if (this.selectedFilters.find((filter) => filter.id === item.id)) {
      return;
    }
    this.selectedFilters.push({ title: item.title, id: item.id });
  }

  onChipRemove(i: number): void {
    this.selectedFilters.splice(i, 1);
  }

  onAddFilter(): void {
    this.dialogRef.close(this.selectedFilters);
  }
}
