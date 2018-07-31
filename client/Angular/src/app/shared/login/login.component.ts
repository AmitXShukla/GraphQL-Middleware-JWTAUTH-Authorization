import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { BackendService } from '../../services/backend-service';
import { Observable } from "rxjs/Rx";

@Component({
  selector: 'login',
  templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit  {
  socialAuth: boolean = false; // show Google and FB Sign in only when social auth is enabled
  error: any;
  dataLoading: boolean = false;
  brokenNetwork = false;
  user: boolean = false;
  data: Observable<any>;

  constructor(private _router: Router, private _backendService: BackendService) { }

  ngOnInit() {
    if(environment.socialAuthEnabled) {
      this.socialAuth = true; // show Google and FB Sign in only when social auth is enabled
    }
    if(localStorage.getItem("token")) {
      this.user = true;
    }
}

  login(formData) {
    this._backendService.loginUser(formData).valueChanges.subscribe(res => {
      this.dataLoading = false;
      if(res.data["loginUser_Q"].token != "") {
        window.localStorage.setItem("token",res.data["loginUser_Q"].token);
        this.user = true;
      } else {
        this.error = "UserID/Password don't match.";
      }
    },
    (error) => {
      this.error = error;
      this.brokenNetwork = true;
    },
    () => {
      this.error = false;
      this.dataLoading = false;
      this.brokenNetwork = false;
    }
    );
    }

    logout() {
      window.localStorage.removeItem("token");
      this.user = false;
    }
  }