import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { TokenService } from '../../../../core/services/token.service';
import { EmpAchievement } from '../../../emp-achievement/models/emp-achievement';
import { EmpAttitudeSkill } from '../../../emp/emp-attitude-skill/models/emp-attitude-skill';
import { GroupAchievement } from '../../../group-achievement/model/group-achievement';
import { GroupAttitudeSkill } from '../../../group-attitude-skill/models/group-attitude-skill';
import { User } from '../../../users/models/user';
import { UserService } from '../../../users/services/user.service';
import { Summary } from '../../models/summary';
import { SummaryService } from '../../services/summary.service';
import { TableComponent } from '../table/table.component';
@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [TableComponent, CommonModule, MessageModule, ButtonModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent implements OnChanges, OnInit {
  @Input() userId: string = '';
  @Input() year = new Date().getFullYear();
  @Output() assSumAvailable = new EventEmitter<boolean>(false);
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
  currentUser: User = {} as User;

  constructor(
    private readonly summarySvc: SummaryService,
    private readonly tokenSvc: TokenService,
    private readonly userSvc: UserService
  ) {}
  ngOnInit(): void {
    const jwtPayload = this.tokenSvc.decodeToken(this.tokenSvc.getToken()!);
    this.userSvc.getById(jwtPayload.sub!).subscribe({
      next: (data) => {
        this.currentUser = data.content;
        console.log(this.currentUser);
      },
      error: (err) => {
        console.error('Error getting current user: ', err);
      },
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['userId'] && this.userId) || changes['year']) {
      this.percentage = 0.0;
      this.summarySvc.calculateSummary(this.userId, this.year).subscribe({
        next: (data) => {
          this.assessmentSummaryAvailable = data.success;
          this.assSumAvailable.emit(this.assessmentSummaryAvailable);
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

  exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Assessment Summary');

    // Define border style using ExcelJS.BorderStyle
    const borderStyle: Partial<ExcelJS.Borders> = {
      top: { style: 'thin' as ExcelJS.BorderStyle },
      left: { style: 'thin' as ExcelJS.BorderStyle },
      bottom: { style: 'thin' as ExcelJS.BorderStyle },
      right: { style: 'thin' as ExcelJS.BorderStyle },
    };

    // Add headers
    worksheet.addRow(['ASSESSMENT SUMMARY REPORT']);
    worksheet.addRow(['Year:', this.year]);
    worksheet.mergeCells('A1:D1');
    worksheet.getCell('A1').alignment = { horizontal: 'center' };
    worksheet.getCell('A1').font = { bold: true, size: 14 };

    // Attitude Skills Section
    worksheet.addRow(['']);
    worksheet.addRow(['ATTITUDE SKILLS']);
    const attitudeHeaderRow = worksheet.addRow([
      'Aspect',
      'Score',
      'Weight',
      'Final Score',
    ]);
    attitudeHeaderRow.eachCell((cell) => {
      cell.border = borderStyle;
      cell.font = { bold: true };
    });

    this.summary.attitude_skills?.forEach((skill) => {
      const formattedWeight = `${parseFloat(skill.weight.toFixed(2))}%`;
      const dataRow = worksheet.addRow([
        skill.aspect,
        skill.score,
        formattedWeight,
        parseFloat(skill.final_score.toFixed(2)),
      ]);
      dataRow.eachCell((cell) => {
        cell.border = borderStyle;
      });
    });

    // Achievements Section
    worksheet.addRow(['']);
    worksheet.addRow(['ACHIEVEMENTS']);
    const achievementHeaderRow = worksheet.addRow([
      'Aspect',
      'Score',
      'Weight',
      'Final Score',
    ]);
    achievementHeaderRow.eachCell((cell) => {
      cell.border = borderStyle;
      cell.font = { bold: true };
    });

    this.summary.achievements?.forEach((achievement) => {
      const formattedPercentage = `${parseFloat(
        achievement.weight.toFixed(2)
      )}%`;
      const dataRow = worksheet.addRow([
        achievement.aspect,
        achievement.score,
        formattedPercentage,
        parseFloat(achievement.final_score.toFixed(2)),
      ]);
      dataRow.eachCell((cell) => {
        cell.border = borderStyle;
      });
    });

    // Total Score
    worksheet.addRow(['']);
    const totalScoreRow = worksheet.addRow([
      'Total Score:',
      this.summary.score,
    ]);
    totalScoreRow.eachCell((cell) => {
      cell.border = borderStyle;
    });

    const totalWeightRow = worksheet.addRow(['Total Weight:', this.percentage]);
    totalWeightRow.eachCell((cell) => {
      cell.border = borderStyle;
    });

    // Generate and save file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const fileName = `Assessment_Summary_${this.year}.xlsx`;
      saveAs(blob, fileName);
    });
  }
}
