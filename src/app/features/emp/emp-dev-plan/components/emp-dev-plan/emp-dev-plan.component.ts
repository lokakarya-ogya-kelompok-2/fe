import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TokenService } from '../../../../../core/services/token.service';
import { NavbarComponent } from '../../../../../shared/components/navbar/navbar.component';
import { DevPlan } from '../../../../dev-plan/models/dev-plan';
import { DevPlanService } from '../../../../dev-plan/services/dev-plan.service';
import { UserInformationComponent } from '../../../user-information/components/user-information/user-information.component';
import { EmpDevPlanRequest } from '../../models/emp-dev-plan';
import { EmpDevPlanService } from '../../services/emp-dev-plan.service';

@Component({
  selector: 'app-emp-dev-plan',
  standalone: true,
  imports: [
    NavbarComponent,
    UserInformationComponent,
    UserInformationComponent,
    FormsModule,
    TableModule,
    DividerModule,
    CommonModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
  ],
  templateUrl: './emp-dev-plan.component.html',
  styleUrl: './emp-dev-plan.component.scss',
  providers: [MessageService],
})
export class EmpDevPlanComponent implements OnInit {
  plans: any[] = [];
  private readonly currentYear: number = new Date().getFullYear();
  devPlans: DevPlan[] = [];
  empDevPlans: { [key: string]: EmpDevPlanRequest[] } = {};
  userId: string = '';
  constructor(
    private empDevPlanService: EmpDevPlanService,
    private devPlanService: DevPlanService,
    private readonly tokenSvc: TokenService,
    private readonly messageSvc: MessageService
  ) {}

  ngOnInit(): void {
    this.userId = this.tokenSvc.decodeToken(this.tokenSvc.getToken()!).sub!;
    console.log(this.userId, 'ini user id ');

    this.empDevPlanService
      .getByUserIdAndYear(this.userId, this.currentYear)
      .subscribe({
        next: (data) => {
          console.log(data.content, 'by user id and year');
          data.content.forEach((empDevPlan) => {
            console.log(empDevPlan);
            if (!this.empDevPlans[empDevPlan.dev_plan.id]) {
              this.empDevPlans[empDevPlan.dev_plan.id] = [];
            }
            this.empDevPlans[empDevPlan.dev_plan.id].push({
              id: empDevPlan.id,
              assessment_year: empDevPlan.assessment_year,
              dev_plan_id: empDevPlan.dev_plan.id,
              detail: empDevPlan.detail,
            });
          });
          console.log('Employee Dev Plans: ', this.empDevPlans);
        },
      });
    // this.getAllEmpDevPlan();
    this.devPlanService.getAllDevPlan().subscribe({
      next: (data) => {
        this.devPlans = data.content;
        console.log(this.plans);
      },
      error: (err) => {
        console.error('Error fetching dev plan:', err);
      },
    });
  }
  getAllEmpDevPlan(): void {
    this.empDevPlanService.getAllEmpDevPlans().subscribe({
      next: (data) => {
        this.devPlans = data.content;
        console.log(this.plans);
      },
      error: (err) => {
        console.error('Error fetching emp dev plan:', err);
      },
    });
  }

  addField(key: string) {
    if (!this.empDevPlans[key]) {
      this.empDevPlans[key] = [];
    }
    this.empDevPlans[key].push({} as EmpDevPlanRequest);
  }
  removeField(key: string, ix: number) {
    this.empDevPlans[key] = this.empDevPlans[key].filter((_, i) => i !== ix);
  }

  onSubmit() {
    const submit = window.confirm('u sure?');
    if (!submit) {
      return;
    }
    this.messageSvc.clear();
    let empDevPlanRequest: EmpDevPlanRequest[] = [];
    Object.entries(this.empDevPlans).forEach(([devPlanId, userInputs]) => {
      userInputs.forEach((userInput) => {
        if (userInput.id) {
          return;
        }
        userInput.dev_plan_id = devPlanId;
        userInput.assessment_year = this.currentYear;
        empDevPlanRequest.push(userInput);
        console.log(empDevPlanRequest, 'ini request emp dev plan');
      });
    });
    console.log(this.devPlans, 'DEV PLANS');

    this.empDevPlanService.insertBulk(empDevPlanRequest).subscribe({
      next: (data) => {
        console.log(data);
        this.messageSvc.add({
          severity: 'success',
          summary: 'Add',
          detail: 'New Dev Plan Added!',
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error: (err) => {
        this.messageSvc.add({
          severity: 'error',
          summary: 'Delete',
          detail: err.error?.message,
        });
      },
    });
  }
}
