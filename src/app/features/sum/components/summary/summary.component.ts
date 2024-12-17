import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MessageModule } from 'primeng/message';
import { EmpAchievement } from '../../../emp-achievement/models/emp-achievement';
import { EmpAttitudeSkill } from '../../../emp/emp-attitude-skill/models/emp-attitude-skill';
import { GroupAchievement } from '../../../group-achievement/model/group-achievement';
import { GroupAttitudeSkill } from '../../../group-attitude-skill/models/group-attitude-skill';
import { Summary } from '../../models/summary';
import { SummaryService } from '../../services/summary.service';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [TableComponent, CommonModule, MessageModule],
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
  assessmentSummaryAvailable = false;

  percentage: number = 0.0;
  summary: Summary = {} as Summary;
  constructor(private readonly summarySvc: SummaryService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['userId'] && this.userId) || changes['year']) {
      this.percentage = 0.0;
      this.summarySvc.calculateSummary(this.userId, this.year).subscribe({
        next: (data) => {
          this.assessmentSummaryAvailable = data.success;
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
          console.error('Error calculating user summary: ', err);
        },
      });
    }
  }
}
