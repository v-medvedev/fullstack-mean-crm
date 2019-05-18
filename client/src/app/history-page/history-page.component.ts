import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MaterialInstance, MaterialService} from '../shared/classes/material.service';
import {OrdersService} from '../shared/services/orders.service';
import {Filter, Order} from '../shared/interfaces';
import {Subscription} from 'rxjs';

const STEP = 2

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tooltip') tooltipRef: ElementRef;

  isFilterVisible = false;
  tooltip: MaterialInstance;
  offset: number = 0;
  limit: number = STEP;
  oSub: Subscription;
  orders: Order[] = [];
  loading = false;
  reloading = false;
  noMoreOrders = false;
  filter: Filter = {};

  constructor(private ordersService: OrdersService) { }

  ngOnInit() {
    this.fetch();
  }

  ngOnDestroy(): void {
    this.tooltip.destroy();
    this.oSub.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  private fetch() {
    this.reloading = true;
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    })
    this.oSub = this.ordersService.fetch(params).subscribe(
      (orders: Order[]) => {
        this.orders = this.orders.concat(orders);
        this.loading = false;
        this.reloading = false;
        this.noMoreOrders = orders.length < STEP;
      }
    )
  }

  loadMore() {
    this.loading = true;
    this.offset += STEP;
    this.fetch();
  }

  applyFilter(filter: Filter) {
    this.orders = [];
    this.filter = filter;
    this.offset = 0;
    this.reloading = true;
    this.fetch();
  }

  isFiltered(): boolean {
    return Object.keys(this.filter).length > 0;
  }

}
