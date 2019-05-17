import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";
import {OrderService} from "./order.service";
import {OrderItem, Order} from "../shared/interfaces";
import {OrdersService} from '../shared/services/orders.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('modal') modalRef: ElementRef;

  modal: MaterialInstance;
  isRoot: boolean;
  pending = false;
  oSub: Subscription;

  constructor(private router: Router,
              private order: OrderService,
              private ordersService: OrdersService) { }

  ngOnInit() {
    this.isRoot = this.router.url === '/order';
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order';
      }
    });
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy(): void {
    this.modal.destroy();
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }

  open() {
    this.modal.open();
  }

  cancel() {
    this.modal.close();
  }

  submit() {
    this.pending = true;
    const order: Order = {
      list: this.order.list.map((item: OrderItem) => {
        delete item._id;
        return item;
      })
    };
    this.oSub = this.ordersService.create(order).subscribe(
      (newOrder) => {
        this.order.clear();
        MaterialService.toast(`Order #${newOrder.order} have been created`);
      }, err => MaterialService.toast(err.error.message),
      () => {
        this.modal.close();
        this.pending = false;
      }
    );
  }

  removePosition(item: OrderItem) {
    this.order.remove(item);
  }

}
