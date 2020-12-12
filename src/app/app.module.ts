import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { StoreModule } from "@ngrx/store";
import { FormsModule } from "@angular/forms";
import { EffectsModule } from "@ngrx/effects";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { AppComponent } from "./app.component";

import { BookShelfComponent } from "./components/book-shelf.component";
import { BookComponent } from "./components/book.component";


@NgModule({
	declarations: [
		AppComponent,
		BookShelfComponent,
		BookComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		EffectsModule.forRoot([]),
		StoreModule.forRoot({}, {
			runtimeChecks: {
				strictStateSerializability: true,
				strictActionSerializability: true,
				strictStateImmutability: true,
				strictActionImmutability: true,
				strictActionWithinNgZone: true,
				strictActionTypeUniqueness: true,
			}
		}),
		StoreDevtoolsModule.instrument({})
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
