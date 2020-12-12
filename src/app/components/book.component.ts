import { Component, Input } from "@angular/core";
import { Book } from "../models/models";


@Component({
	selector: "book",
	template: `<pre>{{ book | json }}</pre>`,
})
export class BookComponent {
	@Input() book: Book;
}
