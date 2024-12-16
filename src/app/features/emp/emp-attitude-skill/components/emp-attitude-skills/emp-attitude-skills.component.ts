import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../../core/services/auth.service';
import { TokenService } from '../../../../../core/services/token.service';
import { NavbarComponent } from '../../../../../shared/components/navbar/navbar.component';
import { TokenPayload } from '../../../../../shared/types';
import { GroupAttitudeSkill } from '../../../../group-attitude-skill/models/group-attitude-skill';
import { GroupAttitudeSkillService } from '../../../../group-attitude-skill/services/group-attitude-skill.service';
import { User } from '../../../../users/models/user';
import { UserService } from '../../../../users/services/user.service';
import { UserInformationComponent } from '../../../user-information/components/user-information/user-information.component';
import { EmpAttitudeSkillRequest } from '../../models/emp-attitude-skill';
import { EmpAttitudeSkillsService } from '../../services/emp-attitude-skills.service';
interface ScoreCategory {
  category: string;
  score: number;
}

@Component({
  selector: 'app-emp-attitude-skills',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    TableModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
    CardModule,
    UserInformationComponent,
    DividerModule,
    TooltipModule,
  ],
  templateUrl: './emp-attitude-skills.component.html',
  styleUrl: './emp-attitude-skills.component.scss',
})
export class EmpAttitudeSkillsComponent implements OnInit {
  jwtPayload: TokenPayload = {} as TokenPayload;
  groupAttitudeSkills: GroupAttitudeSkill[] = [];
  userLogin: User = {} as User;
  currentYear: number = new Date().getFullYear();
  scoreCategories: ScoreCategory[] = [
    { category: 'Excellent', score: 100 },
    { category: 'Good', score: 80 },
    { category: 'Fair', score: 60 },
    { category: 'Poor', score: 40 },
    { category: 'Very Poor', score: 20 },
  ];
  newEmpAttitudeSkill: EmpAttitudeSkillRequest = {} as EmpAttitudeSkillRequest;
  empAttitudeSkills: { [key: string]: EmpAttitudeSkillRequest } = {};
  submissible: boolean = false;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private groupAttitudeSkillService: GroupAttitudeSkillService,
    private userService: UserService,
    private empAttitudeSkillService: EmpAttitudeSkillsService
  ) {}

  ngOnInit(): void {
    this.getToken();
    this.getUser();
    forkJoin({
      empAttitudeSkills: this.empAttitudeSkillService.getEmpAttitudeSkill({
        user_ids: [this.jwtPayload.sub!],
        years: [this.currentYear],
        enabled_only: true,
      }),
      groupAttitudeSkills:
        this.groupAttitudeSkillService.getGroupAttitudeSkills({
          enabled_only: true,
          with_attitude_skills: true,
          with_enabled_child_only: true,
        }),
    }).subscribe({
      next: (data) => {
        data.empAttitudeSkills.content.forEach((empAttitudeSkill) => {
          this.empAttitudeSkills[empAttitudeSkill.attitude_skill.id] = {
            id: empAttitudeSkill.id,
            score: empAttitudeSkill.score,
            attitude_skill_id: empAttitudeSkill.attitude_skill.id,
            assessment_year: empAttitudeSkill.assessment_year,
          };
        });
        this.groupAttitudeSkills = data.groupAttitudeSkills.content;
        this.groupAttitudeSkills.forEach((group) => {
          group.attitude_skills?.forEach((attitudeSkill) => {
            if (!this.empAttitudeSkills[attitudeSkill.id]) {
              this.empAttitudeSkills[attitudeSkill.id] = {
                attitude_skill_id: attitudeSkill.id,
                assessment_year: this.currentYear,
              } as EmpAttitudeSkillRequest;
            }
          });
          this.submissible = Object.values(this.empAttitudeSkills)
            .flat()
            .some((empAs) => empAs.id === undefined);
        });
      },
      error: (err) => {
        console.error(
          'Error fetching empAttitudeSkill/groupAttitudeSkill: ',
          err
        );
        Swal.fire({
          icon: 'error',
          title: err.error.message,
        });
      },
    });
  }

  createEmpAttitudeSkill(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'After submitting this form, you will not be able to modify the data. Are you sure you want to proceed?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.empAttitudeSkillService
          .createEmpAttitudeSkill(
            Object.values(this.empAttitudeSkills).filter(
              (empAttitudeSkill) => !empAttitudeSkill.id
            )
          )
          .subscribe({
            next: (data) => {
              Swal.fire({
                title: 'Emp Attitude Skill created!',
                icon: 'success',
              });
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            },
            error: (err) => {
              console.error('Error creating employee attitude skill:', err);
              Swal.fire({
                icon: 'error',
                title: 'Failed to create employee attitude skill',
                text: err.error.message,
              });
            },
          });
      }
    });
  }

  getUser() {
    this.userService.getById(this.jwtPayload.sub!).subscribe({
      next: (data) => {
        this.userLogin = data.content;
      },
    });
  }

  getToken(): void {
    const token = this.tokenService.getToken();
    if (token && this.authService.isAuthenticated()) {
      this.jwtPayload = this.tokenService.decodeToken(token);
    }
  }

  stringify(obj: object) {
    return JSON.stringify(obj);
  }
}
