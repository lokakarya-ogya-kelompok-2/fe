import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { AuthService } from '../../../../../core/services/auth.service';
import { TokenService } from '../../../../../core/services/token.service';
import { NavbarComponent } from '../../../../../shared/components/navbar/navbar.component';
import { ManageGroupAttitudeSkillService } from '../../../../group-attitude-skill/services/manage-group-attitude-skill.service';
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
  jwtPayload: any = {};
  groupAttitudeSkills: any[] = [];
  userLogin: any = {};
  currentYear: number = new Date().getFullYear();
  scoreCategory: scoreCategory[] = [];
  newEmpAttitudeSkill: EmpAttitudeSkillRequest = {} as EmpAttitudeSkillRequest;
  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private groupAttitudeSkillService: ManageGroupAttitudeSkillService,
    private userService: UserService,
    private empAttitudeSkillService: EmpAttitudeSkillsService
  ) {}

  ngOnInit(): void {
    this.getToken();
    this.getGroupAttitudeSkill();
    this.getUser();
    this.scoreCategory = [
      { category: 'Excellent', score: 100 },
      { category: 'Good', score: 80 },
      { category: 'Fair', score: 60 },
      { category: 'Poor', score: 40 },
      { category: 'Very Poor', score: 20 },
    ];
  }

  createEmpAttitudeSkill(): void {
    console.log('hasil submit: ', this.groupAttitudeSkills);
    let result: any[] = [];
    this.groupAttitudeSkills.forEach((group) => {
      if (group.attitude_skills && group.attitude_skills.length > 0) {
        group.attitude_skills.forEach((skill: any) => {
          result.push({
            attitude_skill_id: skill.id,
            score: skill.score,
            assessment_year: this.currentYear,
            user_id: this.jwtPayload.sub,
          });
        });
      }
    });
    console.log(result, 'HASILNYA');
    this.empAttitudeSkillService
      .createEmpAttitudeSkill(this.groupAttitudeSkills)
      .subscribe({
        next: (data) => {
          console.log(data);
        },
      });
  }
  getUser() {
    this.userService.list().subscribe({
      next: (data) => {
        console.log(data.content);
        this.userLogin = data.content.filter(
          (user) => user.id == this.jwtPayload.sub
        )[0];
        console.log(this.userLogin);
      },
    });
  }
  getToken(): void {
    const token = this.tokenService.getToken();
    if (token && this.authService.isAuthenticated()) {
      this.jwtPayload = this.tokenService.decodeToken(token);
    }
    console.log(this.jwtPayload);
  }

  getGroupAttitudeSkill() {
    this.groupAttitudeSkillService.getGroupAttitudeSkillss().subscribe({
      next: (data) => {
        console.log(data.content);
        this.groupAttitudeSkills = data.content;
        console.log(this.groupAttitudeSkills, 'ini dari ngoninit');
      },
    });
  }
}
