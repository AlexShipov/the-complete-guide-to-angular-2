import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnDestroy {

  constructor(
    private recipeSvc: RecipeService,
    private toastr: ToastrService,
    public authSvc: AuthService,
    private router: Router) { }

  private subscr: Subscription
  private fetchSubscr: Subscription;

  onSaveData() {
    this.subscr = this.recipeSvc.saveData()
      .subscribe(_ => this.toastr.success('Success!'), _ => this.toastr.error('fail :('));
  }

  onFetchData() {
    this.fetchSubscr = this.recipeSvc.fetchData()
      .subscribe(_ => this.toastr.success('Success!'), _ => this.toastr.error('fail :('));
  }

  onSignOut() {
    this.authSvc.signOut().then(_ => {
      this.toastr.info('Bye!')
      this.router.navigate(['/signin']);
    });
  }

  ngOnDestroy() {
    if (this.subscr) {
      this.subscr.unsubscribe();
    }

    if (this.fetchSubscr) {
      this.fetchSubscr.unsubscribe();
    }
  }
}
