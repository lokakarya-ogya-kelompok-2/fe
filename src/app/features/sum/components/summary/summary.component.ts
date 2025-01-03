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
import { FormsModule } from '@angular/forms';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import Swal from 'sweetalert2';
import { TokenService } from '../../../../core/services/token.service';
import {
  EmpAchievement,
  EmpAchievementRequest,
} from '../../../emp-achievement/models/emp-achievement';
import { EmpAchievementService } from '../../../emp-achievement/services/emp-achievement.service';
import {
  EmpAttitudeSkill,
  EmpAttitudeSkillRequest,
} from '../../../emp/emp-attitude-skill/models/emp-attitude-skill';
import { EmpAttitudeSkillsService } from '../../../emp/emp-attitude-skill/services/emp-attitude-skills.service';
import { GroupAchievement } from '../../../group-achievement/model/group-achievement';
import { GroupAttitudeSkill } from '../../../group-attitude-skill/models/group-attitude-skill';
import { User } from '../../../users/models/user';
import { UserService } from '../../../users/services/user.service';
import { EmpAchievementFormData, Summary } from '../../models/summary';
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
    DialogModule,
    FormsModule,
    InputTextModule,
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent implements OnChanges, OnInit {
  @Input() editableAndAllowApprove: boolean = false;
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
  showApproveButton: boolean = false;
  visible: boolean = false;
  empAchievementEditData: EmpAchievement = {} as EmpAchievement;
  formData: EmpAchievementFormData = {
    score: 0,
    notes: '',
  };
  constructor(
    private readonly summarySvc: SummaryService,
    private readonly tokenSvc: TokenService,
    private readonly userSvc: UserService,
    private readonly empAttitudeSkillSvc: EmpAttitudeSkillsService,
    private readonly empAchievementSvc: EmpAchievementService
  ) {}
  ngOnInit(): void {
    const jwtPayload = this.tokenSvc.decodeToken(this.tokenSvc.getToken()!);
    this.userSvc.getById(jwtPayload.sub!).subscribe({
      next: (data) => {
        this.currentUser = data.content;
        this.showApproveButton = this.currentUser.roles.some(
          (role) => role.role_name.toLowerCase() == 'svp'
        );
      },
      error: (err) => {
        console.error('Error getting current user: ', err);
      },
    });
  }

  fetchAssessmentSummary() {
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

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['userId'] && this.userId) || changes['year']) {
      this.fetchAssessmentSummary();
    }
  }

  exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Assessment Summary');

    const borderStyle: Partial<ExcelJS.Borders> = {
      top: { style: 'thin' as ExcelJS.BorderStyle },
      left: { style: 'thin' as ExcelJS.BorderStyle },
      bottom: { style: 'thin' as ExcelJS.BorderStyle },
      right: { style: 'thin' as ExcelJS.BorderStyle },
    };

    worksheet.addRow(['ASSESSMENT SUMMARY REPORT']);
    worksheet.addRow(['Year:', this.year]);
    worksheet.mergeCells('A1:D1');
    worksheet.getCell('A1').alignment = { horizontal: 'center' };
    worksheet.getCell('A1').font = { bold: true, size: 14 };

    worksheet.columns = [
      { header: 'Aspect', key: 'aspect', width: 40 },
      { header: 'Score', key: 'score', width: 20 },
      { header: 'Weight', key: 'weight', width: 10 },
      { header: 'Final Score', key: 'final_score', width: 15 },
    ];

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

      if (skill.items && skill.items.length > 0) {
        skill.items.forEach((item: any) => {
          const childRow = worksheet.addRow([
            `    - ${item.attitude_skill.attitude_skill}`,
            `${item.score} (${this.getScoreCategory(item.score)})`,
            '',
            '',
          ]);
          childRow.getCell(1).font = { color: { argb: '008000' } };
          childRow.getCell(2).font = { color: { argb: '008000' } };
        });
      }
    });

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

      if (achievement.items && achievement.items.length > 0) {
        achievement.items.forEach((item: any) => {
          const childRow = worksheet.addRow([
            `    - ${item.achievement_id.achievement}`,
            `${item.score} (${this.getScoreCategory(item.score)})`,
            '',
            '',
          ]);
          childRow.getCell(1).font = { color: { argb: '008000' } };
          childRow.getCell(2).font = { color: { argb: '008000' } };
        });
      }
    });

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

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const fileName = `Assessment_Summary_${this.currentUser.full_name}_${this.year}.xlsx`;
      saveAs(blob, fileName);
    });
  }

  getScoreCategory(score: number): string {
    if (score >= 80 && score <= 100) return 'Excellent';
    if (score >= 60 && score < 80) return 'Good';
    if (score >= 40 && score < 60) return 'Fair';
    if (score >= 20 && score < 40) return 'Poor';
    return 'Very Poor';
  }

  exportToPDF() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Assessment Summary Report', 14, 22);

    doc.setFontSize(12);
    doc.text(`Year: ${this.year}`, 14, 30);

    doc.setFontSize(14);
    doc.text('Attitude Skills', 14, 40);

    const attitudeSkillsData: any = [];
    this.summary.attitude_skills?.forEach((skill) => {
      attitudeSkillsData.push([
        skill.aspect,
        skill.score,
        `${parseFloat(skill.weight.toFixed(2))}%`,
        parseFloat(skill.final_score.toFixed(2)),
      ]);

      if (skill.items && skill.items.length > 0) {
        skill.items.forEach((item: any) => {
          attitudeSkillsData.push([
            {
              text: `    - ${item.attitude_skill.attitude_skill}`,
              color: 'green',
              style: 'child',
            },
            {
              text: `${item.score} (${this.getScoreCategory(item.score)})`,
              color: 'green',
              style: 'child',
            },
            '',
            '',
          ]);
        });
      }
    });

    (doc as any).autoTable({
      head: [['Aspect', 'Score', 'Weight', 'Final Score']],
      body: attitudeSkillsData,
      startY: 45,
      theme: 'grid',
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 35 },
        2: { cellWidth: 25 },
        3: { cellWidth: 30 },
      },

      didParseCell: (data: any) => {
        if (
          data.cell.raw &&
          typeof data.cell.raw === 'object' &&
          data.cell.raw.text
        ) {
          data.cell.text = data.cell.raw.text;

          if (data.cell.raw.color) {
            data.cell.styles.textColor = data.cell.raw.color;
          }
        }
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text('Achievements', 14, finalY);

    const achievementsData: any = [];
    this.summary.achievements?.forEach((achievement) => {
      achievementsData.push([
        { text: achievement.aspect, style: 'parent' },
        achievement.score,
        `${parseFloat(achievement.weight.toFixed(2))}%`,
        parseFloat(achievement.final_score.toFixed(2)),
      ]);

      if (achievement.items && achievement.items.length > 0) {
        achievement.items.forEach((item: any) => {
          achievementsData.push([
            {
              text: `    - ${item.achievement_id.achievement}`,
              color: 'green',
              style: 'child',
            },
            {
              text: `${item.score}`,
              color: 'green',
              style: 'child',
            },
            '',
            '',
          ]);
        });
      }
    });

    (doc as any).autoTable({
      head: [['Aspect', 'Score', 'Weight', 'Final Score']],
      body: achievementsData,
      startY: finalY + 5,
      theme: 'grid',
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 35 },
        2: { cellWidth: 25 },
        3: { cellWidth: 30 },
      },
      didParseCell: (data: any) => {
        if (
          data.cell.raw &&
          typeof data.cell.raw === 'object' &&
          data.cell.raw.text
        ) {
          data.cell.text = data.cell.raw.text;

          if (data.cell.raw.color) {
            data.cell.styles.textColor = data.cell.raw.color;
          }
        }
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

  onApprove(id: string) {
    Swal.fire({
      icon: 'question',
      title:
        'Are you sure you want to approve this assessment? This action cannot be undone.',
      customClass: {
        container: 'z-9999',
      },
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((res) => {
      if (res.isConfirmed) {
        this.summarySvc.approve(id).subscribe({
          next: (data) => {
            Swal.fire({
              customClass: {
                container: 'z-9999',
              },
              icon: 'success',
              title: 'Approved!',
              text: data.message,
            }).then((res) => {
              if (res.isConfirmed) {
                this.fetchAssessmentSummary();
              }
            });
          },
          error: (err) => {
            console.error('Error approving assessment summary: ', err);
            Swal.fire({
              customClass: {
                container: 'z-9999',
              },
              icon: 'error',
              title: 'Failed to approve',
              text: err.error.message,
            });
          },
        });
      }
    });
  }

  attitudeSkill(data: EmpAttitudeSkill) {
    console.log('attitude skill INI: ', data);
    const editData: EmpAttitudeSkillRequest = {
      id: data.id,
      attitude_skill_id: data.attitude_skill.id,
      score: data.score,
      assessment_year: data.assessment_year,
    };
    this.empAttitudeSkillSvc.update(editData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Attitude skill updated successfully',
          customClass: {
            container: 'z-10k',
          },
        });
        this.fetchAssessmentSummary();
      },
      error: (err) => {
        console.error('Error updating attitude skill: ', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed to update attitude skill',
          text: err.error.message,
          customClass: {
            container: 'z-10k',
          },
        });
        this.fetchAssessmentSummary();
      },
    });
  }

  achievement(data: EmpAchievement) {
    this.empAchievementEditData = data;
    this.formData.score = data.score;
    this.formData.notes = data.notes;
    console.log('achievement INI: ', data);
    this.visible = true;
    console.log(this.formData);
  }

  empAchievementEdit() {
    console.log('tessssssssssssssss');
    console.log(this.formData);

    const editData: EmpAchievementRequest = {
      id: this.empAchievementEditData.id,
      user_id: this.empAchievementEditData.user_id.id,
      notes: this.formData.notes,
      achievement_id: this.empAchievementEditData.achievement_id.id,
      score: this.formData.score,
      assessment_year: this.empAchievementEditData.assessment_year,
    };

    console.log(editData, 'editttttttttttttttttttttt');

    this.empAchievementSvc.updateEmpAchievement(editData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Achievement updated successfully',
          customClass: {
            container: 'z-10k',
          },
        });
        this.visible = false;
        this.fetchAssessmentSummary();
      },
      error: (err) => {
        console.error('Error updating achievement: ', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed to update achievement',
          text: err.error.message,
          customClass: {
            container: 'z-10k',
          },
        });
        this.fetchAssessmentSummary();
      },
    });
  }
}
