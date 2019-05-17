import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CategoriesService } from "../../shared/services/categories.service";
import { switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { MaterialService } from "../../shared/classes/material.service";
import {Category, Message} from "../../shared/interfaces";

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit {

  @ViewChild('input') inputRef: ElementRef;

  isNew = true;
  form: FormGroup;
  image: File;
  imagePreview;
  category: Category;

  constructor(private route: ActivatedRoute,
              private categoriesService: CategoriesService,
              private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    });
    this.form.disable();
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.isNew = false;
            return this.categoriesService.getById(params.id);
          }
          return of(null);
        })
      ).subscribe((category) => {
        if (category) {
          this.form.patchValue({
            name: category.name
          });
          this.category = category;
          this.imagePreview = category.imageSrc;
          MaterialService.updateTextInputs();
        }
        this.form.enable();
      }, (err) => {
        MaterialService.toast(err.error.message);
      });
  }

  onSubmit() {
    this.form.disable();
    let obs$;
    if (this.isNew) {
      obs$ = this.categoriesService.create(this.form.value.name, this.image);
    } else {
      obs$ = this.categoriesService.update(this.category._id, this.form.value.name, this.image);
    }
    obs$.subscribe(
      (category: Category) => {
        this.form.enable();
        MaterialService.toast('Changes saved');
        this.category = category;
      }, (err) => {
        this.form.enable();
        MaterialService.toast(err.error.message);
      }
    )
  }

  triggerClick() {
    this.inputRef.nativeElement.click();
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(file);
  }

  deleteCategory() {
    const decision = window.confirm(`Are you sure to remove category ${this.category.name}?`);
    if (decision) {
      this.categoriesService.delete(this.category._id)
        .subscribe(
          (res: Message) => MaterialService.toast(res.message),
          (err: Message) => MaterialService.toast(err.message),
          () => this.router.navigate(['/categories'])
        );
    }
  }

}
