import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { OfflineDirective } from './directives/offline.directive';
import { HeroDetailsComponent } from "./components/hero-details/hero-details.component";
import { HeroesListComponent } from "./components/heroes-list/heroes-list.component";
@NgModule({
  declarations: [
    AppComponent,
    HeroDetailsComponent,
    HeroesListComponent,
    NavbarComponent,
    OfflineDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent],
})
export class AppModule {}
