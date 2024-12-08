import { Component, Input, OnInit } from '@angular/core';
import { TokenService } from '../../../../core/services/token.service';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { TokenPayload } from '../../../../shared/types';
import { AchievementService } from '../../../achievement/services/achievement.service';
import { EmpAttitudeSkill } from '../../../emp/emp-attitude-skill/models/emp-attitude-skill';
import { EmpAttitudeSkillsService } from '../../../emp/emp-attitude-skill/services/emp-attitude-skills.service';
import { UserInformationComponent } from '../../../emp/user-information/components/user-information/user-information.component';
import { GroupAchievementService } from '../../../group-achievement/services/group-achievement.service';
import { GroupAttitudeSkill } from '../../../group-attitude-skill/models/group-attitude-skill';
import { ManageGroupAttitudeSkillService } from '../../../group-attitude-skill/services/manage-group-attitude-skill.service';
import { Summary } from '../../models/summary';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [NavbarComponent, UserInformationComponent, TableComponent],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent implements OnInit {
  @Input() userId: string = '';
  currentYear = new Date().getFullYear();
  tokenPayload: TokenPayload = {} as TokenPayload;
  groupAttitudeSkills: GroupAttitudeSkill[] = [];
  currentUserAttitudeSkillsGroupedByGroupId: {
    [key: string]: EmpAttitudeSkill[];
  } = {};
  attitudeSkillIdToGroupId: { [key: string]: string } = {};
  userAttitudeSkillSummary: Summary[] = [];
  constructor(
    private readonly tokenSvc: TokenService,
    private readonly groupAttitudeSkillSvc: ManageGroupAttitudeSkillService,
    private readonly groupAchievementSvc: GroupAchievementService,
    private readonly achievementSvc: AchievementService,
    private readonly empAttitudeSkillSvc: EmpAttitudeSkillsService
  ) {}

  ngOnInit(): void {
    this.tokenPayload = this.tokenSvc.decodeToken(this.tokenSvc.getToken()!);
    this.fetchAttitudeSkills();
  }

  fetchAttitudeSkills() {
    this.groupAttitudeSkillSvc.getGroupAttitudeSkills().subscribe({
      next: (data) => {
        this.groupAttitudeSkills = data.content;
        this.groupAttitudeSkills.forEach((group) => {
          group.attitude_skills?.forEach((attitudeSkill) => {
            this.attitudeSkillIdToGroupId[attitudeSkill.id] = group.id;
          });
        });
      },
      error: (err) => {
        console.error('Error fetching group_attitude_skill: ', err);
      },
      complete: () => {
        this.empAttitudeSkillSvc
          .getByUserIdAndYear(this.tokenPayload.sub!, this.currentYear)
          .subscribe({
            next: (data) => {
              data.content.forEach((empAttitudeSkill) => {
                console.log(empAttitudeSkill);
                if (
                  !this.currentUserAttitudeSkillsGroupedByGroupId[
                    this.attitudeSkillIdToGroupId[
                      empAttitudeSkill.attitude_skill.id
                    ]
                  ]
                ) {
                  this.currentUserAttitudeSkillsGroupedByGroupId[
                    this.attitudeSkillIdToGroupId[
                      empAttitudeSkill.attitude_skill.id
                    ]
                  ] = [];
                }
                this.currentUserAttitudeSkillsGroupedByGroupId[
                  this.attitudeSkillIdToGroupId[
                    empAttitudeSkill.attitude_skill.id
                  ]
                ].push(empAttitudeSkill);
              });
            },
            error: (err) => {
              console.error('Error fetching emp_attitude_skill: ', err);
            },
            complete: () => {
              let totalWeight = 0;
              this.groupAttitudeSkills.forEach((group) => {
                totalWeight += group.percentage;
              });
              this.groupAttitudeSkills.forEach((group) => {
                const summary = {
                  aspect: group.group_name,
                  weight: group.percentage / totalWeight,
                } as Summary;
                let totalScore = 0;
                this.currentUserAttitudeSkillsGroupedByGroupId[
                  group.id
                ].forEach((empAttitudeSkill) => {
                  totalScore += empAttitudeSkill.score;
                });
                summary.score = Math.round(
                  (totalScore / (100 * (group.attitude_skills?.length ?? 0))) *
                    100
                );
                summary.finalScore = Math.round(summary.score * summary.weight);
                summary.weight = Math.round(summary.weight * 100);
                this.userAttitudeSkillSummary.push(summary);
              });
            },
          });
      },
    });
  }
  fetchAchievements() {
    this.groupAttitudeSkillSvc.getGroupAttitudeSkills().subscribe({
      next: (data) => {
        this.groupAttitudeSkills = data.content;
        this.groupAttitudeSkills.forEach((group) => {
          group.attitude_skills?.forEach((attitudeSkill) => {
            this.attitudeSkillIdToGroupId[attitudeSkill.id] = group.id;
          });
        });
      },
      error: (err) => {
        console.error('Error fetching group_attitude_skill: ', err);
      },
      complete: () => {
        this.empAttitudeSkillSvc
          .getByUserIdAndYear(this.tokenPayload.sub!, this.currentYear)
          .subscribe({
            next: (data) => {
              data.content.forEach((empAttitudeSkill) => {
                console.log(empAttitudeSkill);
                if (
                  !this.currentUserAttitudeSkillsGroupedByGroupId[
                    this.attitudeSkillIdToGroupId[
                      empAttitudeSkill.attitude_skill.id
                    ]
                  ]
                ) {
                  this.currentUserAttitudeSkillsGroupedByGroupId[
                    this.attitudeSkillIdToGroupId[
                      empAttitudeSkill.attitude_skill.id
                    ]
                  ] = [];
                }
                this.currentUserAttitudeSkillsGroupedByGroupId[
                  this.attitudeSkillIdToGroupId[
                    empAttitudeSkill.attitude_skill.id
                  ]
                ].push(empAttitudeSkill);
              });
            },
            error: (err) => {
              console.error('Error fetching emp_attitude_skill: ', err);
            },
            complete: () => {
              let totalWeight = 0;
              this.groupAttitudeSkills.forEach((group) => {
                totalWeight += group.percentage;
              });
              this.groupAttitudeSkills.forEach((group) => {
                const summary = {
                  aspect: group.group_name,
                  weight: group.percentage / totalWeight,
                } as Summary;
                let totalScore = 0;
                this.currentUserAttitudeSkillsGroupedByGroupId[
                  group.id
                ].forEach((empAttitudeSkill) => {
                  totalScore += empAttitudeSkill.score;
                });
                summary.score = Math.round(
                  (totalScore / (100 * (group.attitude_skills?.length ?? 0))) *
                    100
                );
                summary.finalScore = Math.round(summary.score * summary.weight);
                summary.weight = Math.round(summary.weight * 100);
                this.userAttitudeSkillSummary.push(summary);
              });
            },
          });
      },
    });
  }
}
