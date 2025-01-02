import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { TokenService } from '../../../../core/services/token.service';
import { EmpAttitudeSkillsService } from '../../../emp/emp-attitude-skill/services/emp-attitude-skills.service';
import { UserService } from '../../../users/services/user.service';
import { Summary, SummaryItem } from '../../models/summary';
import { SummaryService } from '../../services/summary.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    TreeTableModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  [key: string]: any;
  @Input() isScoreCategorical: boolean = false;
  @Input() data: SummaryItem[] = [];
  expandedRows: { [key: string]: boolean } = {};
  @Input() tableHeader: string = '';
  @Input() updateFunction: string = '';
  @Output() onButtonClick = new EventEmitter<any>();
  summary: Summary = {} as Summary;
  constructor(
    private readonly summarySvc: SummaryService,
    private readonly tokenSvc: TokenService,
    private readonly userSvc: UserService,
    private readonly empAttitudeSkillSvc: EmpAttitudeSkillsService
  ) {}
  ngOnInit() {
    if (this.data) {
      this.data.forEach((item) => {
        this.expandedRows[item.aspect] = false;
      });
    }
  }

  // fetchAssessmentSummary() {
  //   this.summarySvc
  //     .calculateSummary(this.userId, this.selectedYear)
  //     .subscribe({});
  // }
  getScoreCategory(score: number): string {
    if (score >= 80 && score <= 100) return 'Excellent';
    if (score >= 60 && score < 80) return 'Good';
    if (score >= 40 && score < 60) return 'Fair';
    if (score >= 20 && score < 40) return 'Poor';
    return 'Very Poor';
  }
  dropdownScoreCategories = [
    { label: 'Excellent', value: 100 },
    { label: 'Good', value: 80 },
    { label: 'Fair', value: 60 },
    { label: 'Poor', value: 40 },
    { label: 'Very Poor', value: 20 },
  ];
  stringify(obj: Object) {
    return JSON.stringify(obj);
  }

  onScoreChange(year: number, id: string, event: any, child: any) {
    child.score = event.value;
    child.id = id;
    child.assessment_year = year;
    console.log(child.score, 'ini scoreeeeeeeeee');
    console.log(child.id, 'ini id');
    console.log(child.assessment_year, 'ini year');
  }

  // updateAttitudeSkill() {
  //   console.log('update attitude skill data');
  // }
  // updateAchievement() {
  //   console.log('update achievement data');
  // }

  // updateChild(
  //   id: string,
  //   attitude_skill_id: string,
  //   year: number,
  //   score: number
  // ) {
  //   console.log(id, 'ini id');
  //   console.log(attitude_skill_id, 'ini attitude skill id');
  //   console.log(year, 'ini year');
  //   console.log(score, 'ini score');
  // }
}
