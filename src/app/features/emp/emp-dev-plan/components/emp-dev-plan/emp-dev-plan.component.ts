import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
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
    CardModule,
    FloatLabelModule,
  ],
  templateUrl: './emp-dev-plan.component.html',
  styleUrl: './emp-dev-plan.component.scss',
  providers: [MessageService],
})
export class EmpDevPlanComponent implements OnInit {
  private readonly currentYear: number = new Date().getFullYear();
  devPlans: DevPlan[] = [];
  empDevPlans: { [key: string]: EmpDevPlanRequest[] } = {};
  userId: string = '';
  submissible: boolean = false;
  constructor(
    private empDevPlanService: EmpDevPlanService,
    private devPlanService: DevPlanService,
    private readonly tokenSvc: TokenService,
    private readonly messageSvc: MessageService
  ) {}

  ngOnInit(): void {
    this.userId = this.tokenSvc.decodeToken(this.tokenSvc.getToken()!).sub!;

    forkJoin({
      empDevPlans: this.empDevPlanService.getAllEmpDevPlans({
        user_ids: [this.userId],
        years: [this.currentYear],
      }),
      devPlans: this.devPlanService.getAllDevPlan(),
    }).subscribe(({ empDevPlans, devPlans }) => {
      empDevPlans.content.forEach((empDevPlan) => {
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
      this.devPlans = devPlans.content;
      devPlans.content.forEach((devPlan) => {
        if (!this.empDevPlans[devPlan.id]) {
          this.empDevPlans[devPlan.id] = [
            {
              assessment_year: this.currentYear,
            } as EmpDevPlanRequest,
          ];
        }
      });
      this.checkSubmissible();
    });
  }

  addField(key: string) {
    if (!this.empDevPlans[key]) {
      this.empDevPlans[key] = [];
    }
    this.empDevPlans[key].push({
      assessment_year: this.currentYear,
    } as EmpDevPlanRequest);
    this.checkSubmissible();
  }

  removeField(key: string, ix: number) {
    this.empDevPlans[key] = this.empDevPlans[key].filter((_, i) => i !== ix);
    this.checkSubmissible();
  }

  onSubmit() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'After submitting this form, you will not be able to modify the data. Are you sure you want to proceed?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
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
          });
        });

        this.empDevPlanService.insertBulk(empDevPlanRequest).subscribe({
          next: (data) => {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'New Dev Plan Added!',
              showConfirmButton: true,
              confirmButtonText: 'Ok',
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              }
            });
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
    });
  }

  checkSubmissible() {
    this.submissible = Object.values(this.empDevPlans)
      .flat()
      .some((req) => req.id == undefined);
  }
}
