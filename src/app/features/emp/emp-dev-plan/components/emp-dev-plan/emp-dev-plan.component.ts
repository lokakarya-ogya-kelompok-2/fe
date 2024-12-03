import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../../shared/components/navbar/navbar.component';
import { EmpDevPlanService } from '../../services/emp-dev-plan.service';

@Component({
  selector: 'app-emp-dev-plan',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './emp-dev-plan.component.html',
  styleUrl: './emp-dev-plan.component.scss',
})
export class EmpDevPlanComponent {
  datas: any[] = [];
  constructor(
    private empDevPlanService: EmpDevPlanService // private confirmationService: ConfirmationService, // private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getAllEmpDevPlan();
  }
  getAllEmpDevPlan(): void {
    this.empDevPlanService.getAllEmpDevPlans().subscribe({
      next: (data) => {
        this.datas = data.content;
        console.log(this.datas);
      },
      error: (err) => {
        console.error('Error fetching emp dev plan:', err);
      },
    });
  }
}
