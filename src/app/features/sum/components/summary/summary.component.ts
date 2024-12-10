import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { EmpAchievement } from '../../../emp-achievement/models/emp-achievement';
import { EmpAchievementService } from '../../../emp-achievement/services/emp-achievement.service';
import { EmpAttitudeSkill } from '../../../emp/emp-attitude-skill/models/emp-attitude-skill';
import { EmpAttitudeSkillsService } from '../../../emp/emp-attitude-skill/services/emp-attitude-skills.service';
import { GroupAchievement } from '../../../group-achievement/model/group-achievement';
import { GroupAchievementService } from '../../../group-achievement/services/group-achievement.service';
import { GroupAttitudeSkill } from '../../../group-attitude-skill/models/group-attitude-skill';
import { ManageGroupAttitudeSkillService } from '../../../group-attitude-skill/services/manage-group-attitude-skill.service';
import { Summary, SummaryItem } from '../../models/summary';
import { SummaryService } from '../../services/summary.service';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent implements OnChanges {
  @Input() userId: string = '';
  @Input() year = new Date().getFullYear();
  groupAttitudeSkills: GroupAttitudeSkill[] = [];
  groupAchievements: GroupAchievement[] = [];
  currentUserAttitudeSkillsGroupedByGroupId: {
    [key: string]: EmpAttitudeSkill[];
  } = {};
  currentUserAchievementsGroupedByGroupId: {
    [key: string]: EmpAchievement[];
  } = {};
  idToGroupId: { [key: string]: string } = {};
  totalWeight = 0;

  percentage: number = 0.0;
  summary: Summary = {} as Summary;
  // summaryData: SummaryData = {} as SummaryData;
  constructor(
    private readonly groupAttitudeSkillSvc: ManageGroupAttitudeSkillService,
    private readonly groupAchievementSvc: GroupAchievementService,
    private readonly empAttitudeSkilltSvc: EmpAttitudeSkillsService,
    private readonly empAchievementSvc: EmpAchievementService,
    private readonly summarySvc: SummaryService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && this.userId) {
      this.summarySvc.calculateSummary(this.userId, this.year).subscribe({
        next: (data) => {
          this.summary = data.content;
          this.summary.achievements?.forEach((item) => {
            this.percentage += item.weight;
          });
          this.summary.attitude_skills?.forEach((item) => {
            this.percentage += item.weight;
          });
          console.log(this.summary, ' INI');
        },
        error: (err) => {
          console.error('Error fetching summary: ', err);
        },
      });
      // forkJoin({
      //   attitudeSkills: this.fetchAttitudeSkills(),
      //   achievements: this.fetchAchievements(),
      // })
      //   .pipe(
      //     catchError((error) => {
      //       console.error('Error fetching summary data:', error);
      //       return of({ attitudeSkills: [], achievements: [] });
      //     })
      //   )
      //   .subscribe((results) => {
      //     this.summaryData = {
      //       attitudeSkillSummary: results.attitudeSkills,
      //       achievementSummary: results.achievements,
      //       totalScore: 0,
      //       totalPercentage: 0,
      //     };
      //     this.summaryData.attitudeSkillSummary =
      //       this.summaryData.attitudeSkillSummary.map((item) => {
      //         item.weight /= this.totalWeight;
      //         item.finalScore = Math.round(item.score * item.weight);
      //         this.summaryData.totalScore += item.finalScore;
      //         item.weight = Math.round(item.weight * 100);
      //         this.summaryData.totalPercentage += item.weight;
      //         return item;
      //       });
      //     this.summaryData.achievementSummary =
      //       this.summaryData.achievementSummary.map((item) => {
      //         item.weight /= this.totalWeight;
      //         item.finalScore = Math.round(item.score * item.weight);
      //         this.summaryData.totalScore += item.finalScore;
      //         item.weight = Math.round(item.weight * 100);
      //         this.summaryData.totalPercentage += item.weight;
      //         return item;
      //       });
      //   });
    }
  }

  fetchAttitudeSkills(): Observable<SummaryItem[]> {
    return this.groupAttitudeSkillSvc.getGroupAttitudeSkills().pipe(
      switchMap((groupData) => {
        const idToGroupId: { [key: string]: string } = {};

        groupData.content.forEach((group) => {
          this.totalWeight += group.percentage;
          group.attitude_skills?.forEach((attitudeSkill) => {
            idToGroupId[attitudeSkill.id] = group.id;
          });
        });

        return this.empAttitudeSkilltSvc
          .getByUserIdAndYear(this.userId, this.year)
          .pipe(
            map((empData) => {
              const groupedSkills: { [key: string]: EmpAttitudeSkill[] } = {};

              empData.content.forEach((empAttitudeSkill) => {
                const groupId = idToGroupId[empAttitudeSkill.attitude_skill.id];
                if (!groupedSkills[groupId]) {
                  groupedSkills[groupId] = [];
                }
                groupedSkills[groupId].push(empAttitudeSkill);
              });

              return groupData.content.map((group) => {
                const summary: SummaryItem = {
                  aspect: group.group_name,
                  weight: group.percentage,
                } as SummaryItem;

                let totalScore = 0;
                groupedSkills[group.id]?.forEach((empAchievement) => {
                  totalScore += empAchievement.score;
                });

                summary.score =
                  Math.round(
                    (totalScore /
                      (100 * (group.attitude_skills?.length ?? 0))) *
                      100
                  ) || 0;

                return summary;
              });
            })
          );
      })
    );
  }

  fetchAchievements(): Observable<SummaryItem[]> {
    return this.groupAchievementSvc.getGroupAchievements().pipe(
      switchMap((groupData) => {
        const idToGroupId: { [key: string]: string } = {};

        groupData.content.forEach((group) => {
          this.totalWeight += group.percentage;
          group.achievements?.forEach((achievement) => {
            idToGroupId[achievement.id] = group.id;
          });
        });

        return this.empAchievementSvc
          .getByUserIdAndYear(this.userId, this.year)
          .pipe(
            map((empData) => {
              const groupedAchievements: { [key: string]: any[] } = {};

              empData.content.forEach((empAchievement) => {
                const groupId = idToGroupId[empAchievement.achievement_id.id];
                if (!groupedAchievements[groupId]) {
                  groupedAchievements[groupId] = [];
                }
                groupedAchievements[groupId].push(empAchievement);
              });

              return groupData.content.map((group) => {
                const summary: SummaryItem = {
                  aspect: group.group_name,
                  weight: group.percentage,
                } as SummaryItem;

                let totalScore = 0;
                groupedAchievements[group.id]?.forEach((empAchievement) => {
                  totalScore += empAchievement.score;
                });

                summary.score =
                  Math.round(
                    (totalScore / (100 * (group.achievements?.length ?? 0))) *
                      100
                  ) || 0;

                return summary;
              });
            }),
            catchError((err) => {
              console.error('Error fetching emp_achievement: ', err);
              return of([]);
            })
          );
      }),
      catchError((err) => {
        console.error('Error fetching group_achievement: ', err);
        return of([]);
      })
    );
  }
}
