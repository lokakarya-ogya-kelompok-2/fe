import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { NavbarComponent } from '../../../../../shared/components/navbar/navbar.component';
import { UserInformationComponent } from '../../../user-information/components/user-information/user-information.component';
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
  ],
  templateUrl: './emp-dev-plan.component.html',
  styleUrl: './emp-dev-plan.component.scss',
})
export class EmpDevPlanComponent implements OnInit {
  plans: any[] = [];
  constructor(
    private empDevPlanService: EmpDevPlanService // private confirmationService: ConfirmationService, // private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getAllEmpDevPlan();
  }
  getAllEmpDevPlan(): void {
    this.empDevPlanService.getAllEmpDevPlans().subscribe({
      next: (data) => {
        this.plans = data.content;
        console.log(this.plans);
      },
      error: (err) => {
        console.error('Error fetching emp dev plan:', err);
      },
    });
  }
}
