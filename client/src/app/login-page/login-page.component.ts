import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Subscription } from "rxjs";

import { AuthService } from "../shared/services/auth.service";
import { MaterialService } from "../shared/classes/material.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  aSub: Subscription;

  constructor(private  auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        // Now you can login using your credentials
        MaterialService.toast('Now you can login using your credentials');
      } else if (params['accessDenied']) {
        // You need to authorize to access the page
        MaterialService.toast('You need to authorize to access the page');
      } else if (params['sessionExpired']) {
        // Session expired, please re login
        MaterialService.toast('Session expired, please re login');
      }
    });
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

  onSubmit() {
    this.form.disable();
    this.aSub = this.auth.login(this.form.value).subscribe(
      () => {
        console.log('Login success');
        this.router.navigate(['/overview'])
      },
      err => {
        MaterialService.toast(err.error.message);
        this.form.enable();
      }
    );
  }

}
