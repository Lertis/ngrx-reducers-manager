import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	template: `
  <button (click)="addBookShelf()">Add a bookshelf</button>
  <button (click)="removeAllBookShelves()">Remove Everything</button>
  <div style="display: flex; flex-direction: row">
    <book-shelf
      *ngFor="let bookShelf of bookShelves; index as i"
      [index]="i">
    </book-shelf>
  </div>
  `,
})
export class AppComponent {
	bookShelves = [0];

	addBookShelf() {
		this.bookShelves.push(1);
	}

	removeAllBookShelves() {
		this.bookShelves = [];
	}
}
