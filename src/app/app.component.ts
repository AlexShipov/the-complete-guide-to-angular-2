import { Component, OnInit } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedFeature = 'recipe';

  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }

  ngOnInit() {
    firebase.initializeApp({
      apiKey: 'AIzaSyCFa7zfHOl5CYFHKZ8Mgr2R9URa8vb6Fc0',
      authDomain: 'ng-recipe-book-7efbc.firebaseapp.com'
      // databaseURL: "https://ng-recipe-book-7efbc.firebaseio.com",
      // projectId: "ng-recipe-book-7efbc",
      // storageBucket: "ng-recipe-book-7efbc.appspot.com",
      // messagingSenderId: "488235485153"
    });
  }
}
