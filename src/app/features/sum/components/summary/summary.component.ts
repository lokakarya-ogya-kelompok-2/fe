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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
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
  imports: [
    TableComponent,
    CommonModule,
    MessageModule,
    ButtonModule,
    ProgressSpinnerModule,
  ],
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
  isLoading = true;

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
      },
      error: (err) => {
        console.error('Error getting current user: ', err);
      },
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['userId'] && this.userId) || changes['year']) {
      this.isLoading = true;
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
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
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

    worksheet.columns = [
      { header: 'Aspect', key: 'aspect', width: 40 },
      { header: 'Score', key: 'score', width: 10 },
      { header: 'Weight', key: 'weight', width: 10 },
      { header: 'Final Score', key: 'final_score', width: 15 },
    ];
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
      const fileName = `Assessment_Summary_${this.currentUser.full_name}_${this.year}.xlsx`;
      saveAs(blob, fileName);
    });
  }

  exportToPDF() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Assessment Summary Report', 14, 22);

    doc.setFontSize(12);
    doc.text(`Year: ${this.year}`, 14, 30);

    doc.setFontSize(14);
    doc.text('Attitude Skills', 14, 40);

    const attitudeSkillsData = this.summary.attitude_skills?.map((skill) => [
      skill.aspect,
      skill.score,
      `${parseFloat(skill.weight.toFixed(2))}%`,
      parseFloat(skill.final_score.toFixed(2)),
    ]);

    (doc as any).autoTable({
      head: [['Aspect', 'Score', 'Weight', 'Final Score']],
      body: attitudeSkillsData,
      startY: 45,
      theme: 'grid',
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 30 },
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text('Achievements', 14, finalY);

    const achievementsData = this.summary.achievements?.map((achievement) => [
      achievement.aspect,
      achievement.score,
      `${parseFloat(achievement.weight.toFixed(2))}%`,
      parseFloat(achievement.final_score.toFixed(2)),
    ]);

    (doc as any).autoTable({
      head: [['Aspect', 'Score', 'Weight', 'Final Score']],
      body: achievementsData,
      startY: finalY + 5,
      theme: 'grid',
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 30 },
      },
    });

    const finalY2 = (doc as any).lastAutoTable.finalY + 10;

    const totalData = [
      ['Total Score:', `${parseFloat(this.summary.score.toFixed(2))}%`],
      ['Total Weight:', `${this.percentage}%`],
    ];

    (doc as any).autoTable({
      body: totalData,
      startY: finalY2,
      theme: 'grid',
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 20 },
      },
    });

    doc.save(
      `Assessment_Summary_${this.currentUser.full_name}_${this.year}.pdf`
    );
  }
}
