import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  map,
  Observable,
  Subject,
  Subscription,
  take,
  takeUntil,
} from 'rxjs';

export class InifityScrollDatasource<T> extends DataSource<T | undefined> {
  private _initiaLength: number;
  private _pageSize: number;
  private _cachedData: (T | undefined)[];
  private _fetchedPages: Set<number>;
  private _lastPage = -1;

  private readonly _dataStream$: BehaviorSubject<(T | undefined)[]>;
  private readonly _disconnect$: Subject<void>;
  private readonly _subscription: Subscription;

  public readonly loading$: BehaviorSubject<boolean>;
  public readonly isEmpty$: Observable<boolean>;

  constructor(
    pageSize: number,
    private readonly fetchPageUser: (page: number) => Observable<T[]>,
    private readonly scrollToZero: () => void,
    initialLength?: number
  ) {
    super();
    this._pageSize = pageSize;
    this._initiaLength = initialLength ?? 1000;
    this._fetchedPages = new Set<number>();

    this._cachedData = [
      ...Array.from({ length: this._initiaLength }).map(() => undefined),
    ];
    this._dataStream$ = new BehaviorSubject<(T | undefined)[]>(
      this._cachedData
    );
    this._subscription = new Subscription();
    this._disconnect$ = new Subject<void>();
    this.loading$ = new BehaviorSubject<boolean>(false);
    this.isEmpty$ = this._dataStream$
      .pipe(takeUntil(this._disconnect$))
      .pipe(
        map(
          (dataStream) =>
            dataStream.filter((item) => item !== undefined).length === 0
        )
      );
  }

  connect(collectionViewer: CollectionViewer): Observable<(T | undefined)[]> {
    this._subscription.add(
      collectionViewer.viewChange.subscribe((range) => {
        const startPage = this._getPageForIndex(range.start);
        const endPage = this._getPageForIndex(range.end - 1);
        for (let i = startPage; i <= endPage; i++) {
          this._fetchPage(i);
        }
      })
    );
    return this._dataStream$;
  }

  disconnect(): void {
    this._subscription.unsubscribe();
    this._disconnect$.next();
  }

  reset(): void {
    this._fetchedPages = new Set<number>();
    this._cachedData = [
      ...Array.from({ length: this._initiaLength }).map(() => undefined),
    ];
    this.scrollToZero();
    this._dataStream$.next(this._cachedData);
    this._fetchPage(0);
  }

  private _getPageForIndex(index: number): number {
    return Math.floor(index / this._pageSize);
  }

  private _fetchPage(page: number) {
    if (
      this._fetchedPages.has(page) ||
      (this._lastPage != -1 && page > this._lastPage)
    ) {
      return;
    }
    this._fetchedPages.add(page);
    this.loading$.next(true);
    this.fetchPageUser(page)
      .pipe(take(1))
      .subscribe({
        next: (resultItems) => {
          this._cachedData.splice(
            page * this._pageSize,
            this._pageSize,
            ...resultItems
          );

          if (resultItems.length < this._pageSize) {
            this._lastPage = page;
            this._cachedData = this._cachedData.filter(
              (item) => item !== undefined
            );
          } else {
            this._cachedData.push(
              ...Array.from({ length: this._pageSize * 2 }).map(() => undefined)
            );
          }

          this._dataStream$.next(this._cachedData);
          this.loading$.next(false);
        },
        complete: () => {
          this.loading$.next(false);
        },
        error: (err) => {
          this.loading$.next(false);
        },
      });
  }
}
