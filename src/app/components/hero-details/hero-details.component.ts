import { Component, Input, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { HeroesService } from "src/app/services/heroes.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Hero } from "src/app/models/hero.model";

@Component({
  selector: 'app-hero-details',
  templateUrl: './hero-details.component.html',
  styleUrls: ['./hero-details.component.scss']
})
export class HeroDetailsComponent implements OnInit {
  @Input() viewMode = false;
  @Input() currentHero: Hero = {
    Id: "",
    Name: "",
  };
  public updateHeroForm: FormGroup = new FormGroup({});
  public message: String = "";
  public heroId: String = "";
  public heroesIds: Array<String> = new Array<String>();
  public error: Error | undefined;

  constructor(
    private heroesService: HeroesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.message = "";
    this.retrieveHeroes();
    this.getHero(this.route.snapshot.params["id"])
      .then((result) => {
        console.log("Hero loaded");
      })
      .catch((err: Error) => {
        console.log(err);
      });
  }

  private validateId(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const isIdValid = !this.heroesIds
        .filter((d) => d !== this.currentHero.Id)
        .find((heroId: String) => heroId === control.value);

      return !isIdValid ? { idValidErr: true } : null;
    };
  }

  private retrieveHeroes(): void {
    this.heroesService.getAll().subscribe({
      next: (data) => {
        data.forEach((hero) => this.heroesIds.push(hero.Id));

        console.log(data);
      },
      error: (e) => console.error(e),
    });
  }

  public async getHero(id: String): Promise<void> {
    await this.heroesService.get(id).subscribe({
      next: (data) => {
        this.currentHero = data;
        this.heroId = this.currentHero?.Id;
      },
      complete: () => {
        this.createForm();
      },
      error: (e) => console.error(e),
    });
  }

  private createForm(): void {
    if (!this.currentHero) return;
    this.updateHeroForm = new FormGroup({
      Id: new FormControl(this.currentHero.Id, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(4),
        this.validateId(),
      ]),
      Name: new FormControl(this.currentHero.Name, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
      ]),
    });
  }

  public updateHero(): void {
    this.message = "";
    this.heroesService.update(this.heroId, this.updateHeroForm.value).subscribe({
      next: (res) => {
        this.message = res.message
          ? res.message
          : "This Duty was updated successfully!";
      },
      error: (e) => {
        this.message = "Duty was not updated successfully";
        this.error = e;
        console.error(e);
      },
    });
  }

  public deleteHero(): void {
    confirm("Are you sure you want to delete this item?") &&
      this.heroesService.delete(this.currentHero.Id).subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(["/duties"]);
        },
        error: (e) => {
          this.message = "Duty was not deleted successfully";
          this.error = e;

          console.error(e);
        },
      });
  }
}
