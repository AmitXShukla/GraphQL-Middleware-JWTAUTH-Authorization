import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { moveIn, fallIn } from '../shared/router.animations';
import { BackendService } from '../services/backend-service';
import { Observable } from 'rxjs/Observable';

  @Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    animations: [moveIn(), fallIn()],
    host: { '[@moveIn]': '' }
  })
  export class SettingsComponent implements OnInit, OnDestroy {

  state: string = '';
  jwtinvalid = false;
  error: any;
  dataLoading: boolean = false;
  brokenNetwork = false;
  savedChanges = false;
  data;
  user: Observable<any>;
  private querySubscription;

  constructor(private _backendService: BackendService, private router: Router) {
  }

  ngOnInit(){
    this.getUser();
  }

  getUser() {
    this.user = this._backendService.getUser().valueChanges;
  }

  routeLoginPage() {
      window.localStorage.removeItem("token");
      this.savedChanges = false;
      this.router.navigate(['/login']);
    }

  onSubmit(formData) {
    this.querySubscription = this._backendService.updateUser(formData.value).subscribe(res => {
      if(res.data["updateUser_M"].email != "") {
        this.jwtinvalid = false;
        this.savedChanges = true;
        this.dataLoading = false;
      } else {
        this.jwtinvalid = true;
        this.dataLoading = false;
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
  ngOnDestroy() {
    // this is not needed when observable is used, in this case, we are registering user on subscription
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}