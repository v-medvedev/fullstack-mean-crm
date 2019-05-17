import { Component, OnInit } from '@angular/core';
import {CategoriesService} from "../../shared/services/categories.service";
import {Category} from "../../shared/interfaces";
import {Observable} from "rxjs";

@Component({
  selector: 'app-order-categories',
  templateUrl: './order-categories.component.html',
  styleUrls: ['./order-categories.component.css']
})
export class OrderCategoriesComponent implements OnInit {

  categories$: Observable<Category[]>;

  constructor(private categoryService: CategoriesService) { }

  ngOnInit() {
    this.categories$ = this.categoryService.fetch();
  }

}
