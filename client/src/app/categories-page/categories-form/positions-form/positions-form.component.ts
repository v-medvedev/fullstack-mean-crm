import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PositionsService} from "../../../shared/services/positions.service";
import {Position} from "../../../shared/interfaces";
import {MaterialInstance, MaterialService} from "../../../shared/classes/material.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('categoryId') categoryId: string;
  @ViewChild('modal') modalRef: ElementRef;

  positions: Position[];
  isLoading = false;
  modal: MaterialInstance;
  form: FormGroup;
  positionId = null;

  constructor(private positionsService: PositionsService) { }

  ngOnInit() {
    this.isLoading = true;
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      cost: new FormControl(null, [Validators.required, Validators.min(1)])
    });
    this.positionsService.fetch(this.categoryId)
      .subscribe((positions: Position[]) => {
        this.positions = positions;
        this.isLoading = false;
      })
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy(): void {
    this.modal.destroy();
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id;
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    });
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onAddPosition() {
    this.positionId = null;
    this.form.reset({
      name: null,
      cost: 1
    });
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onCancel() {
    this.modal.close();
  }

  onSubmit() {

    const onPositionError = (err) => {
      MaterialService.toast(err.error.message)
    }

    const onPositionCompleted = () => {
      this.modal.close();
      this.form.enable();
    }

    this.form.disable();
    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    };
    if (this.positionId) {
      newPosition._id = this.positionId;
      // edit
      this.positionsService.update(newPosition).subscribe(
        (position: Position) => {
          const idx = this.positions.findIndex(p => p._id === position._id);
          this.positions[idx] = position;
          MaterialService.toast('Position have been updated');
        }, onPositionError,
        onPositionCompleted
      );
    } else {
      // create
      this.positionsService.create(newPosition).subscribe(
        (position: Position) => {
          MaterialService.toast('Position have been created');
          this.positions.push(position);
        }, onPositionError,
        onPositionCompleted
      );
    }
  }

  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation();
    const decision = window.confirm(`Are you sure to remove position ${position.name} ?`);
    if (decision) {
      this.positionsService.delete(position).subscribe(
        res => {
          const idx = this.positions.findIndex(p => p._id === position._id);
          this.positions.splice(idx, 1);
          MaterialService.toast('Position have been removed');
        }, err => MaterialService.toast(err.error.message)
      );
    }
  }

}
