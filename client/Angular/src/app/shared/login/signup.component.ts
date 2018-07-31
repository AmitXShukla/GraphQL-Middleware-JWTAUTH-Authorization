import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { moveIn, fallIn } from '../router.animations';
import { BackendService } from '../../services/backend-service';

@Component({
  selector: 'signup',
  templateUrl: 'signup.component.html',
  animations: [moveIn(), fallIn()],
  host: { '[@moveIn]': '' }
})
export class SignupComponent implements OnDestroy {

  state: string = '';
  idtaken = false;
  error: any;
  dataLoading: boolean = false;
  brokenNetwork = false;
  savedChanges = false;
  data;
  private querySubscription;

  constructor(private _backendService: BackendService, private router: Router) {
  }

  routeLoginPage() {
    this.router.navigate(['/login']);
  }

  onSubmit(formData) {
    this.querySubscription = this._backendService.createUser(formData.value).subscribe(res => {
      if(res.data["addUser_M"]["email"] != "") {
        this.idtaken = false;
        this.savedChanges = true;
        this.dataLoading = false;
      } else {
        this.idtaken = true;
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
    // this is not needed when mydata observable is used, in this case, we are registering user on subscription, this is why it's called
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}