import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddGameFormComponent } from './add-game-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GameService } from '../../services/game';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('AddGameFormComponent', () => {
  let component: AddGameFormComponent;
  let fixture: ComponentFixture<AddGameFormComponent>;
  let mockGameService: any;

  beforeEach(async () => {
    mockGameService = {
      addGame: (title: string, price: number) => of({ id: 99, title, price, available: true })
    };

    await TestBed.configureTestingModule({
      imports: [AddGameFormComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: GameService, useValue: mockGameService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddGameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize empty title and 0 price with validation errors', () => {
    expect(component.gameForm).toBeDefined();
    expect(component.title?.value).toBe('');
    expect(component.price?.value).toBe(0);
    expect(component.gameForm.valid).toBeFalsy();
  });

  it('should fail validation when title is empty', () => {
    component.title?.setValue('');
    expect(component.title?.hasError('required')).toBeTruthy();
  });

  it('should fail validation when title starts with lowercase letter', () => {
    component.title?.setValue('portal 3');
    expect(component.title?.hasError('titleLowercase')).toBeTruthy();
  });

  it('should pass validation when title starts with uppercase letter', () => {
    component.title?.setValue('Portal 3');
    expect(component.title?.hasError('titleLowercase')).toBeFalsy();
  });

  it('should fail validation when price is less than 1', () => {
    component.price?.setValue(0);
    expect(component.price?.hasError('min')).toBeTruthy();
  });

  it('should submit form and call service and router', () => {
    const router = TestBed.inject(Router);
    const addGameSpy = vi.spyOn(mockGameService, 'addGame');
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.title?.setValue('Portal 3');
    component.price?.setValue(25);
    fixture.detectChanges();

    expect(component.gameForm.valid).toBeTruthy();
    component.onSubmit();

    expect(addGameSpy).toHaveBeenCalledWith('Portal 3', 25);
    expect(navigateSpy).toHaveBeenCalledWith(['/games']);
  });
});
