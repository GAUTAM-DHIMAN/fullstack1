import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { GameService } from '../../services/game';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-game-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-game-form.component.html',
  styleUrl: './add-game-form.component.css'
})
export class AddGameFormComponent implements OnInit {
  gameForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private gameService: GameService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.gameForm = this.fb.group({
      title: ['', [Validators.required, this.titleUppercaseValidator]],
      price: [0, [Validators.required, Validators.min(1)]]
    });
  }

  titleUppercaseValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (!value) return null; // Let 'required' validator handle empty values
    
    const firstLetter = value.charAt(0);
    if (firstLetter !== firstLetter.toUpperCase()) {
      return { 'titleLowercase': true };
    }
    return null;
  }

  get title() { return this.gameForm.get('title'); }
  get price() { return this.gameForm.get('price'); }

  onSubmit(): void {
    if (this.gameForm.invalid) {
      this.gameForm.markAllAsTouched();
      return;
    }

    const { title, price } = this.gameForm.value;
    this.gameService.addGame(title, price).subscribe({
      next: () => {
        this.router.navigate(['/games']);
      }
    });
  }
}
