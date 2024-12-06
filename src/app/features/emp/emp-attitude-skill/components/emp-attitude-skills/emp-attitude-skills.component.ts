import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../../core/services/auth.service';
import { TokenService } from '../../../../../core/services/token.service';
import { NavbarComponent } from '../../../../../shared/components/navbar/navbar.component';
import { TokenPayload } from '../../../../../shared/types';
import { GroupAttitudeSkill } from '../../../../group-attitude-skill/models/group-attitude-skill';
import { ManageGroupAttitudeSkillService } from '../../../../group-attitude-skill/services/manage-group-attitude-skill.service';
import { User } from '../../../../users/models/user';
import { UserService } from '../../../../users/services/user.service';
import { UserInformationComponent } from '../../../user-information/components/user-information/user-information.component';
import { EmpAttitudeSkillRequest } from '../../models/emp-attitude-skill';
import { EmpAttitudeSkillsService } from '../../services/emp-attitude-skills.service';
interface scoreCategory {
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
  ],
  templateUrl: './emp-attitude-skills.component.html',
  styleUrl: './emp-attitude-skills.component.scss',
})
export class EmpAttitudeSkillsComponent implements OnInit {
  jwtPayload: TokenPayload = {} as TokenPayload;
  groupAttitudeSkills: GroupAttitudeSkill[] = [];
  userLogin: User = {} as User;
  currentYear: number = new Date().getFullYear();
  scoreCategory: scoreCategory[] = [
    { category: 'Excellent', score: 100 },
    { category: 'Good', score: 80 },
    { category: 'Fair', score: 60 },
    { category: 'Poor', score: 40 },
    { category: 'Very Poor', score: 20 },
  ];
  newEmpAttitudeSkill: EmpAttitudeSkillRequest = {} as EmpAttitudeSkillRequest;
  empAttitudeSkills: { [key: string]: EmpAttitudeSkillRequest } = {};
  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private groupAttitudeSkillService: ManageGroupAttitudeSkillService,
    private userService: UserService,
    private empAttitudeSkillService: EmpAttitudeSkillsService
  ) {}

  ngOnInit(): void {
    this.getToken();
    this.getUser();
    this.empAttitudeSkillService
      .getByUserIdAndYear(this.jwtPayload.sub!, this.currentYear)
      .subscribe({
        next: (data) => {
          data.content.forEach((empAttitudeSkill) => {
            this.empAttitudeSkills[empAttitudeSkill.attitude_skill.id] = {
              id: empAttitudeSkill.id,
              score: empAttitudeSkill.score,
              attitude_skill_id: empAttitudeSkill.attitude_skill.id,
              assessment_year: empAttitudeSkill.assessment_year,
            };
          });
        },
        error: (err) => {
          console.error('Error Fetching employee attitude skill:', err);
          Swal.fire({
            icon: 'error',
            title: 'Failed to fetch employee attitude skill',
          });
        },
        complete: () => {
          this.groupAttitudeSkillService.getGroupAttitudeSkillss().subscribe({
            next: (data) => {
              this.groupAttitudeSkills = data.content;
              this.groupAttitudeSkills.forEach((group) => {
                group.attitude_skills?.forEach((attitudeSkill) => {
                  if (!this.empAttitudeSkills[attitudeSkill.id]) {
                    this.empAttitudeSkills[attitudeSkill.id] = {
                      score: 0,
                      attitude_skill_id: attitudeSkill.id,
                      assessment_year: this.currentYear,
                    };
                  }
                });
              });
            },
            complete: () => {},
          });
        },
      });
  }

  createEmpAttitudeSkill(): void {
    let result: EmpAttitudeSkillRequest[] = [];
    Object.values(this.empAttitudeSkills).forEach((empAttitudeSkill) =>
      result.push(empAttitudeSkill)
    );
    this.empAttitudeSkillService.createEmpAttitudeSkill(result).subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Emp Attitude Skill created!',
          icon: 'success',
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
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
