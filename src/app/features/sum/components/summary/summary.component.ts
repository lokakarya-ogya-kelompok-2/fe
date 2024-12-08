import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EmpAchievement } from '../../../emp-achievement/models/emp-achievement';
import { EmpAchievementService } from '../../../emp-achievement/services/emp-achievement.service';
import { EmpAttitudeSkill } from '../../../emp/emp-attitude-skill/models/emp-attitude-skill';
import { EmpAttitudeSkillsService } from '../../../emp/emp-attitude-skill/services/emp-attitude-skills.service';
import { UserInformationComponent } from '../../../emp/user-information/components/user-information/user-information.component';
import { GroupAchievement } from '../../../group-achievement/model/group-achievement';
import { GroupAchievementService } from '../../../group-achievement/services/group-achievement.service';
import { GroupAttitudeSkill } from '../../../group-attitude-skill/models/group-attitude-skill';
import { ManageGroupAttitudeSkillService } from '../../../group-attitude-skill/services/manage-group-attitude-skill.service';
import { Summary, SummaryData } from '../../models/summary';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [UserInformationComponent, TableComponent],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent implements OnChanges {
  @Input() userId: string = '';
  currentYear = new Date().getFullYear();
  groupAttitudeSkills: GroupAttitudeSkill[] = [];
  groupAchievements: GroupAchievement[] = [];
  currentUserAttitudeSkillsGroupedByGroupId: {
    [key: string]: EmpAttitudeSkill[];
  } = {};
  currentUserAchievementsGroupedByGroupId: {
    [key: string]: EmpAchievement[];
  } = {};
  idToGroupId: { [key: string]: string } = {};
  userAttitudeSkillSummary: Summary[] = [];
  userAchievementSummart: Summary[] = [];
  summaryData: SummaryData = {} as SummaryData;
  constructor(
    private readonly groupAttitudeSkillSvc: ManageGroupAttitudeSkillService,
    private readonly groupAchievementSvc: GroupAchievementService,
    private readonly empAttitudeSkilltSvc: EmpAttitudeSkillsService,
    private readonly empAchievementSvc: EmpAchievementService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && this.userId) {
      this.fetchAttitudeSkills();
      this.fetchAchievements();
    }
  }

  fetchAttitudeSkills() {
    this.groupAttitudeSkillSvc.getGroupAttitudeSkills().subscribe({
      next: (data) => {
        this.groupAttitudeSkills = data.content;
        this.groupAttitudeSkills.forEach((group) => {
          group.attitude_skills?.forEach((attitudeSkill) => {
            this.idToGroupId[attitudeSkill.id] = group.id;
          });
        });
      },
      error: (err) => {
        console.error('Error fetching group_attitude_skill: ', err);
      },
      complete: () => {
        this.empAttitudeSkilltSvc
          .getByUserIdAndYear(this.userId, this.currentYear)
          .subscribe({
            next: (data) => {
              data.content.forEach((empAttitudeSkill) => {
                console.log(empAttitudeSkill);
                if (
                  !this.currentUserAttitudeSkillsGroupedByGroupId[
                    this.idToGroupId[empAttitudeSkill.attitude_skill.id]
                  ]
                ) {
                  this.currentUserAttitudeSkillsGroupedByGroupId[
                    this.idToGroupId[empAttitudeSkill.attitude_skill.id]
                  ] = [];
                }
                this.currentUserAttitudeSkillsGroupedByGroupId[
                  this.idToGroupId[empAttitudeSkill.attitude_skill.id]
                ].push(empAttitudeSkill);
              });
            },
            error: (err) => {
              console.error('Error fetching emp_attitude_skill: ', err);
            },
            complete: () => {
              this.summaryData.attitudeSkillSummary = [];
              // let totalWeight = 0;
              // this.groupAttitudeSkills.forEach((group) => {
              //   totalWeight += group.percentage;
              // });
              this.groupAttitudeSkills.forEach((group) => {
                const summary = {
                  aspect: group.group_name,
                  weight: group.percentage,
                } as Summary;
                let totalScore = 0;
                this.currentUserAttitudeSkillsGroupedByGroupId[
                  group.id
                ]?.forEach((empAchievement) => {
                  totalScore += empAchievement.score;
                });
                summary.score =
                  Math.round(
                    (totalScore /
                      (100 * (group.attitude_skills?.length ?? 0))) *
                      100
                  ) || 0;
                // summary.finalScore =
                //   Math.round(summary.score * summary.weight) || 0;
                // summary.weight = Math.round(summary.weight * 100) || 0;
                this.summaryData.attitudeSkillSummary.push(summary);
              });
            },
          });
      },
    });
  }

  fetchAchievements() {
    for (let itg in this.idToGroupId) {
      delete this.idToGroupId[itg];
    }
    this.groupAchievementSvc.getGroupAchievements().subscribe({
      next: (data) => {
        this.groupAchievements = data.content;
        this.groupAchievements.forEach((group) => {
          group.achievements?.forEach((achievement) => {
            this.idToGroupId[achievement.id] = group.id;
          });
        });
      },
      error: (err) => {
        console.error('Error fetching group_achievement: ', err);
      },
      complete: () => {
        this.empAchievementSvc
          .getByUserIdAndYear(this.userId, this.currentYear)
          .subscribe({
            next: (data) => {
              data.content.forEach((empAchievement) => {
                console.log(empAchievement);
                if (
                  !this.currentUserAchievementsGroupedByGroupId[
                    this.idToGroupId[empAchievement.achievement_id.id]
                  ]
                ) {
                  this.currentUserAchievementsGroupedByGroupId[
                    this.idToGroupId[empAchievement.achievement_id.id]
                  ] = [];
                }
                this.currentUserAchievementsGroupedByGroupId[
                  this.idToGroupId[empAchievement.achievement_id.id]
                ].push(empAchievement);
              });
            },
            error: (err) => {
              console.error('Error fetching emp_attitude_skill: ', err);
            },
            complete: () => {
              this.summaryData.achievementSummary = [];
              // let totalWeight = 0;
              // this.groupAttitudeSkills.forEach((group) => {
              //   totalWeight += group.percentage;
              // });
              this.groupAchievements.forEach((group) => {
                const summary = {
                  aspect: group.group_name,
                  weight: group.percentage,
                } as Summary;
                let totalScore = 0;
                this.currentUserAchievementsGroupedByGroupId[group.id]?.forEach(
                  (empAchievement) => {
                    totalScore += empAchievement.score;
                  }
                );
                summary.score =
                  Math.round(
                    (totalScore / (100 * (group.achievements?.length ?? 0))) *
                      100
                  ) || 0;
                // summary.finalScore =
                //   Math.round(summary.score * summary.weight) || 0;
                // summary.weight = Math.round(summary.weight * 100) || 0;
                this.summaryData.achievementSummary.push(summary);
              });
            },
          });
      },
    });
  }
}
