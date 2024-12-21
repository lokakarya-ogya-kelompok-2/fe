import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { TokenService } from '../../core/services/token.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { EmpAttitudeSkillsComponent } from '../emp/emp-attitude-skill/components/emp-attitude-skills/emp-attitude-skills.component';
import { EmpDevPlanComponent } from '../emp/emp-dev-plan/components/emp-dev-plan/emp-dev-plan.component';
import { EmpTechnicalSkillComponent } from '../emp/emp-technical-skill/components/emp-technical-skill/emp-technical-skill.component';
import { MenuService } from '../menus/services/menu.service';
import { MySummaryComponent } from '../sum/components/my-summary/my-summary.component';
@Component({
  selector: 'app-employee-assessments',
  standalone: true,
  imports: [
    ButtonModule,
    StepperModule,
    EmpAttitudeSkillsComponent,
    EmpTechnicalSkillComponent,
    EmpDevPlanComponent,
    MySummaryComponent,
    NavbarComponent,
    CommonModule,
  ],
  templateUrl: './employee-assessments.component.html',
  styleUrl: './employee-assessments.component.scss',
  styles: [
    `
      .p-stepper {
        flex-basis: 50rem;
      }
    `,
  ],
})
export class EmployeeAssessmentsComponent implements OnInit {
  stepperItems: Map<string, boolean> = new Map<string, boolean>();
  isLoading: boolean = true;
  firstItemId: string | undefined;
  lastItemId: string | undefined;
  constructor(
    private readonly tokenSvc: TokenService,
    private readonly menuSvc: MenuService
  ) {}

  ngOnInit(): void {
    this.stepperItems.set('emp-attitude-skill#all', false);
    this.stepperItems.set('emp-technical-skill#all', false);
    this.stepperItems.set('emp-dev-plan#all', false);
    this.stepperItems.set('summary#read.self', false);
    console.log('BEFORE: ', this.stepperItems);
    const tokenPayload = this.tokenSvc.decodeToken(this.tokenSvc.getToken()!);
    this.menuSvc.getMenuByUserId(tokenPayload.sub!).subscribe({
      next: (data) => {
        data.content.forEach((menu) => {
          if (this.stepperItems.has(menu.menu_name)) {
            this.stepperItems.set(menu.menu_name, true);
          }
        });
        console.log('AFTER: ', this.stepperItems);
        this.stepperItems.forEach((shown, menuId) => {
          if (shown) {
            if (this.firstItemId === undefined) {
              this.firstItemId = menuId;
            }
            this.lastItemId = menuId;
          }
        });
        this.isLoading = false;
      },
    });
  }
}
