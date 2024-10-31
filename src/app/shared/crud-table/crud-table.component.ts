import { NgClass, NgFor, UpperCasePipe, DatePipe, DecimalPipe } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, effect, inject, input, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { ICrudAction } from 'src/app/interfaces/ICrudAction.interface';
import { getBadgeStyles } from 'src/app/utils/utilFunctions';

@Component({
  selector: 'vex-crud-table',
  standalone: true,
  imports: [
    MatIconModule,
    MatTableModule,
    NgClass,
    NgFor,
    MatMenuModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatTooltipModule,
    UpperCasePipe,
    DatePipe,
    DecimalPipe,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTooltipModule
  ],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  templateUrl: './crud-table.component.html',
  styleUrl: './crud-table.component.scss'
})
export class CrudTableComponent implements OnInit, AfterViewInit {
  dataS = input.required<any[]>();
  columnsS = input.required<TableColumn<any>[]>();
  loadingS = input.required<boolean>();
  crudMenuItemsS = input<ICrudAction[]>([]);
  withSearchS = input<boolean>(false);

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  destroyRef: DestroyRef = inject(DestroyRef);
  textTable: string = 'No hay información por mostrar.';
  pageSize: number = 10;
  pageSizeOptions: number[] = [10, 20, 50];
  searchCtrl: FormControl = new FormControl('');

  constructor() {
    effect(() => {
      this.dataSource.data = this.dataS();
      if (this.loadingS()) {
        this.searchCtrl.disable();
        this.textTable = !this.dataSource.data.length || !this.dataS().length ? 'No hay información por mostrar.' : 'Cargando información...';
      } else {
        this.searchCtrl.enable();
        this.textTable = !this.dataSource.data.length || !this.dataS().length ? 'No hay información por mostrar.' : 'Cargando información...';
      }
    });
  }

  ngOnInit(): void {
    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value ?? ''));
  }

  ngAfterViewInit() {
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) this.dataSource.sort = this.sort;
  }

  onFilterChange(value: string): void {
    this.textTable = '';

    if (!this.dataSource) {
      this.textTable = 'No hay información por mostrar.';
      return;
    }

    this.dataSource.filter = value?.trim()?.toLowerCase();
    if (!this.dataSource.filteredData.length) this.textTable = 'No hay información por mostrar.';
  }

  trackByProperty<T>(_index: number, column: TableColumn<T>) {
    return column.property;
  }

  getBadgeStyles(key: string): string[] {
    return getBadgeStyles(key);
  }

  get visibleColumns(): any[] {
    return this.columnsS().filter((column) => column.visible).map((column) => column.property);
  }

  getFilteredCrudActionByPosition(position: 'HEADER' | 'TABLE'): ICrudAction[] {
    return this.crudMenuItemsS()?.filter(a => a.position === position);
  }
}
