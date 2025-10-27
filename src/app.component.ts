import { Component, inject } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, OnboardingComponent, DashboardComponent, LoginComponent],
})
export class AppComponent {
  userService = inject(UserService);
  authService = inject(AuthService);
  userProfile = this.userService.userProfile;
  currentUser = this.authService.currentUser;
}