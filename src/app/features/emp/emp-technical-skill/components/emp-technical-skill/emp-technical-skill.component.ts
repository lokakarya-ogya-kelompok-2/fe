import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
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
  ],
  templateUrl: './emp-technical-skill.component.html',
  styleUrl: './emp-technical-skill.component.scss',
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
    private readonly tokenSvc: TokenService
  ) {}

  ngOnInit() {
    this.userId = this.tokenSvc.decodeToken(this.tokenSvc.getToken()!).sub!;
    this.techSkillSvc.getAllTechnicalSkills().subscribe({
      next: (data) => {
        this.technicalSkills = data.content;
        this.technicalSkills.forEach((techSkill) => {
          this.empTechnicalSkills[techSkill.id] = [{} as EmpTechnicalSkillReq];
        });
      },
      error: (err) => {
        console.error(`error on fetching technical skills: ${err}`);
      },
    });
  }

  addField(key: string) {
    if (!this.empTechnicalSkills[key]) {
      this.empTechnicalSkills[key] = [];
    }
    this.empTechnicalSkills[key].push({} as EmpTechnicalSkillReq);
  }

  onSubmit() {
    let empTechnicalSkillsReq: EmpTechnicalSkillReq[] = [];
    Object.entries(this.empTechnicalSkills).forEach(
      ([techSkillId, userInputs]) => {
        userInputs.forEach((userInput) => {
          userInput.technical_skill_id = techSkillId;
          userInput.assessment_year = this.currentYear;
          empTechnicalSkillsReq.push(userInput);
        });
      }
    );

    console.log(empTechnicalSkillsReq);

    this.empTechSkillSvc.insertBulk(empTechnicalSkillsReq).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.error(`error occured during insert bulk:  ${err}`);
      },
    });
  }
}
