import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TokenService } from '../../../../../core/services/token.service';
import { NavbarComponent } from '../../../../../shared/components/navbar/navbar.component';
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
  ],
  templateUrl: './emp-technical-skill.component.html',
  styleUrl: './emp-technical-skill.component.scss',
  providers: [MessageService],
})
export class EmpTechnicalSkillComponent implements OnInit {
  readonly skillLevels = [
    {
      level: 1,
      description: 'Berpengetahuan',
    },
    {
      level: 2,
      description: 'Memahami (Pernah mengikuti training)',
    },
    {
      level: 3,
      description: 'Praktisi (Pernah handle project)',
    },
    {
      level: 4,
      description: 'Advance (Mampu sharing knowledge)',
    },
    {
      level: 5,
      description: 'Ahli (Mampu memberikan solusi dan konsultasi)',
    },
  ];
  private readonly currentYear: number = new Date().getFullYear();
  technicalSkills: TechnicalSkill[] = [];
  empTechnicalSkills: { [key: string]: EmpTechnicalSkillReq[] } = {};
  userId: string = '';
  constructor(
    private readonly empTechSkillSvc: EmpTechnicalSkillService,
    private readonly techSkillSvc: TechnicalSkillService,
    private readonly tokenSvc: TokenService,
    private readonly messageSvc: MessageService
  ) {}

  ngOnInit() {
    this.userId = this.tokenSvc.decodeToken(this.tokenSvc.getToken()!).sub!;

    this.empTechSkillSvc
      .getByUserIdAndYear(this.userId, this.currentYear)
      .subscribe({
        next: (data) => {
          console.log(data.content);
          data.content.forEach((empTechSkill) => {
            console.log(empTechSkill);
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
            console.log(this.empTechnicalSkills);
          });
          console.log(this.empTechnicalSkills, 'after atas');
        },
        complete: () => {
          this.techSkillSvc.getAllTechnicalSkills().subscribe({
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

  onDelete(id: string) {
    this.messageSvc.clear();
    this.empTechSkillSvc.delete(id).subscribe({
      next: (data) => {
        this.messageSvc.add({
          severity: 'info',
          summary: 'Delete',
          detail: data.message,
        });
      },
      error: (err: any) => {
        this.messageSvc.add({
          severity: 'info',
          summary: 'Delete',
          detail: err.message,
        });
      },
    });
  }

  onSubmit() {
    const submit = window.confirm('u sure?');
    if (!submit) {
      return;
    }
    this.messageSvc.clear();
    let empTechnicalSkillsReq: EmpTechnicalSkillReq[] = [];
    Object.entries(this.empTechnicalSkills).forEach(
      ([techSkillId, userInputs]) => {
        userInputs.forEach((userInput) => {
          if (userInput.id) {
            return;
          }
          userInput.technical_skill_id = techSkillId;
          userInput.assessment_year = this.currentYear;
          empTechnicalSkillsReq.push(userInput);
        });
      }
    );

    this.empTechSkillSvc.insertBulk(empTechnicalSkillsReq).subscribe({
      next: (_) => {
        this.messageSvc.add({
          severity: 'success',
          summary: 'Add',
          detail: 'New Technical Skill Added!',
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
