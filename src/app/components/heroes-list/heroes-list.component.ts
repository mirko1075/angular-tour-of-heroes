import { Component, OnInit } from "@angular/core";
import { Hero } from "src/app/models/hero.model";
import { HeroesService } from "src/app/services/heroes.service";
@Component({
  selector: 'app-heroes-list',
  templateUrl: './heroes-list.component.html',
  styleUrls: ['./heroes-list.component.scss']
})
export class HeroesListComponent implements OnInit {
  public heroes: Hero[] = new Array<Hero>();
  public currentHero: Hero = new Hero("", "");
  public currentIndex = -1;

  constructor(private heroesService: HeroesService) {}

  ngOnInit(): void {
    this.retrieveDuties();
  }

  private retrieveDuties(): void {
    this.heroesService.getAll().subscribe({
      next: (data) => {
        this.heroes = data;
        console.log(data);
      },
      error: (e) => console.error(e),
    });
  }

  public setActiveHero(hero: Hero, index: number): void {
    if (this.currentHero.Id === "") {
      this.currentHero = hero;
      this.currentIndex = index;
    } else {
      this.currentHero = new Hero("", "");
      this.currentIndex = -1;
    }
  }
}
