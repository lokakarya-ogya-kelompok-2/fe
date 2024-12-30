import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import Swal from 'sweetalert2';
import { TokenService } from '../../../../../core/services/token.service';
import { NavbarComponent } from '../../../../../shared/components/navbar/navbar.component';
import { MySummaryComponent } from '../../../../sum/components/my-summary/my-summary.component';
import { TechnicalSkill } from '../../../../technical-skill/models/technical-skill';
import { TechnicalSkillService } from '../../../../technical-skill/services/technical-skill.service';
import { UserInformationComponent } from '../../../user-information/components/user-information/user-information.component';
import { EmpTechnicalSkillReq } from '../../models/emp-technical-skill';
import { EmpTechnicalSkillService } from '../../services/emp-technical-skill.service';

@Component({
  selector: 'app-emp-technical-skill',
  standalone: true,
  imports: [
    TableModule,
    UserInformationComponent,
    NavbarComponent,
    InputTextModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
    ToastModule,
    CommonModule,
    CardModule,
    FloatLabelModule,
    TooltipModule,
    MySummaryComponent,
  ],
  templateUrl: './emp-technical-skill.component.html',
  styleUrl: './emp-technical-skill.component.scss',
  providers: [MessageService],
})
export class EmpTechnicalSkillComponent implements OnInit {
  readonly skillLevels = [
    {
      level: 1,
      description: 'Knowledgeable',
    },
    {
      level: 2,
      description: 'Understanding (Has attended training)',
    },
    {
      level: 3,
      description: 'Practitioner (Has handled projects)',
    },
    {
      level: 4,
      description: 'Advanced (Able to share knowledge)',
    },
    {
      level: 5,
      description: 'Expert (Able to provide solutions and consultancy)',
    },
  ];
  private readonly currentYear: number = new Date().getFullYear();
  technicalSkills: TechnicalSkill[] = [];
  empTechnicalSkills: { [key: string]: EmpTechnicalSkillReq[] } = {};
  userId: string = '';
  constructor(
    private readonly empTechSkillSvc: EmpTechnicalSkillService,
    private readonly techSkillSvc: TechnicalSkillService,
    private readonly tokenSvc: TokenService
  ) {}

  ngOnInit() {
    this.fetchEmpTechnicalSkills();
  }

  fetchEmpTechnicalSkills() {
    this.userId = this.tokenSvc.decodeToken(this.tokenSvc.getToken()!).sub!;

    this.empTechSkillSvc
      .list({
        user_ids: [this.userId],
        years: [this.currentYear],
        enabled_only: true,
      })
      .subscribe({
        next: (data) => {
          data.content.forEach((empTechSkill) => {
            if (!this.empTechnicalSkills[empTechSkill.technical_skill.id]) {
              this.empTechnicalSkills[empTechSkill.technical_skill.id] = [];
            }

            this.empTechnicalSkills[empTechSkill.technical_skill.id].push({
              id: empTechSkill.id,
              assessment_year: empTechSkill.assessment_year,
              technical_skill_id: empTechSkill.technical_skill.id,
              score: empTechSkill.score,
              detail: empTechSkill.detail,
            });
          });
        },
        complete: () => {
          this.techSkillSvc
            .getAllTechnicalSkills({
              enabled_only: true,
            })
            .subscribe({
              next: (data) => {
                this.technicalSkills = data.content;
                this.technicalSkills.forEach((groupTechSkill) => {
                  if (!this.empTechnicalSkills[groupTechSkill.id]) {
                    this.empTechnicalSkills[groupTechSkill.id] = [
                      {} as EmpTechnicalSkillReq,
                    ];
                  }
                });
                this.technicalSkills.sort(
                  (a, b) => b.created_at.getTime() - a.created_at.getTime()
                );
              },
              error: (err) => {
                console.error(`error on fetching technical skills: ${err}`);
              },
            });
        },
      });
  }

  addField(key: string) {
    if (!this.empTechnicalSkills[key]) {
      this.empTechnicalSkills[key] = [];
    }
    this.empTechnicalSkills[key].push({} as EmpTechnicalSkillReq);
  }

  removeField(key: string, ix: number) {
    this.empTechnicalSkills[key] = this.empTechnicalSkills[key].filter(
      (_, i) => i !== ix
    );
  }

  onSubmit(key: string) {
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
        let empTechnicalSkillsReq: EmpTechnicalSkillReq[] =
          this.empTechnicalSkills[key]
            .filter((empTechnicalSkill) => !empTechnicalSkill.id)
            .map((empTechnicalSkill) => {
              empTechnicalSkill.technical_skill_id = key;
              empTechnicalSkill.assessment_year = this.currentYear;
              return empTechnicalSkill;
            });

        this.empTechSkillSvc.insertBulk(empTechnicalSkillsReq).subscribe({
          next: (_) => {
            Swal.fire({
              title: 'Emp Technical Skill created!',
              icon: 'success',
            }).then((res) => {
              if (res.isConfirmed) {
                this.empTechnicalSkills = {};
                this.fetchEmpTechnicalSkills();
              }
            });
          },
          error: (err) => {
            console.error('Failed to insert employee technical skill: ', err);
            Swal.fire({
              icon: 'error',
              title: 'Failed to insert employee technical skill',
              text: err.error.message,
            });
          },
        });
      }
    });
  }
}
