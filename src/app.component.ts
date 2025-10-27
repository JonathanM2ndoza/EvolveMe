import { Component, inject } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { UserService } from './services/user.service';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, OnboardingComponent, DashboardComponent],
})
export class AppComponent {
  userService = inject(UserService);
  userProfile = this.userService.userProfile;
}