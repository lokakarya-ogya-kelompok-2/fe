import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EmpAchievement } from '../../../emp-achievement/models/emp-achievement';
import { EmpAchievementService } from '../../../emp-achievement/services/emp-achievement.service';
import { EmpAttitudeSkill } from '../../../emp/emp-attitude-skill/models/emp-attitude-skill';
import { EmpAttitudeSkillsService } from '../../../emp/emp-attitude-skill/services/emp-attitude-skills.service';
import { GroupAchievement } from '../../../group-achievement/model/group-achievement';
import { GroupAchievementService } from '../../../group-achievement/services/group-achievement.service';
import { GroupAttitudeSkill } from '../../../group-attitude-skill/models/group-attitude-skill';
import { ManageGroupAttitudeSkillService } from '../../../group-attitude-skill/services/manage-group-attitude-skill.service';
import { Summary } from '../../models/summary';
import { SummaryService } from '../../services/summary.service';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [TableComponent, CommonModule],
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
  constructor(
    private readonly groupAttitudeSkillSvc: ManageGroupAttitudeSkillService,
    private readonly groupAchievementSvc: GroupAchievementService,
    private readonly empAttitudeSkilltSvc: EmpAttitudeSkillsService,
    private readonly empAchievementSvc: EmpAchievementService,
    private readonly summarySvc: SummaryService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && this.userId) {
      this.percentage = 0.0;
      this.summarySvc.calculateSummary(this.userId, this.year).subscribe({
        next: (data) => {
          this.summary = data.content;
          this.summary.achievements?.forEach((item) => {
            this.percentage += item.weight;
          });
          this.summary.attitude_skills?.forEach((item) => {
            this.percentage += item.weight;
          });
          this.summary.score =
            this.summary.attitude_skills?.reduce((acc, curr) => {
              return acc + curr.final_score;
            }, 0) || 0;
          this.summary.score =
            this.summary.achievements?.reduce((acc, curr) => {
              return acc + curr.final_score;
            }, this.summary.score) || this.summary.score;
        },
        error: (err) => {
          console.error('Error fetching summary: ', err);
        },
      });
    }
  }
}
