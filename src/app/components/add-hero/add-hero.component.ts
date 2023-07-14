import { Component, OnInit } from "@angular/core";

import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { Hero } from "src/app/models/hero.model";
import { HeroesService } from "src/app/services/heroes.service";

@Component({
  selector: 'app-add-hero',
  templateUrl: './add-hero.component.html',
  styleUrls: ['./add-hero.component.scss']
})
export class AddHeroComponent implements OnInit {
  public addHeroForm: FormGroup = new FormGroup({});
  public hero: Hero = {
    Id: "",
    Name: "",
  };
  public submitted = false;
  public heroesIds: String[] = new Array<String>();
  public error: Error | undefined;
  constructor(private heroesService: HeroesService) {}

  ngOnInit(): void {
    this.addHeroForm = new FormGroup({
      Id: new FormControl(this.hero.Id, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(4),
        this.validateId(),
      ]),
      Name: new FormControl(this.hero.Name, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
      ]),
    });
    this.retrieveHeroes();
  }

  private validateId(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const isIdValid = !this.heroesIds.find(
        (heroId) => heroId === control.value
      );

      return !isIdValid ? { idValidErr: true } : null;
    };
  }

  private retrieveHeroes(): void {
    this.heroesService.getAll().subscribe({
      next: (data) => {
        data.forEach((hero) => this.heroesIds.push(hero.Id));
        console.log(data);
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  public async saveHero(): Promise<void> {
    this.heroesService.create(this.addHeroForm.value).subscribe({
      next: (res) => {
        console.log(res);
        this.submitted = true;
      },
      error: (e) => {
        this.submitted = false;
        this.error = e;
        console.error(e);
      },
    });
  }

  public newHero(): void {
    this.submitted = false;
    this.addHeroForm = new FormGroup({
      Id: new FormControl(this.hero.Id, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(4),
      ]),
      Name: new FormControl(this.hero.Name, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
      ]),
    });
  }
}
