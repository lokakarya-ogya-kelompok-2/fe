import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import Swal from 'sweetalert2';
import { TokenService } from '../../../../core/services/token.service';
import { TokenPayload } from '../../../../shared/types';
import { EmpSuggestionRequest } from '../../models/emp-suggestion';
import { EmpSuggestionService } from '../../services/emp-suggestion.service';
@Component({
  selector: 'app-suggestion',
  standalone: true,
  imports: [CardModule, CommonModule, FormsModule, ButtonModule],
  templateUrl: './suggestion.component.html',
  styleUrl: './suggestion.component.scss',
})
export class SuggestionComponent implements OnInit {
  loading: boolean = false;
  suggestions: string[] = [''];
  userId: string = '';
  currentYear: number = new Date().getFullYear();
  empSuggestionRequests: EmpSuggestionRequest[] = [];
  tokenPayload: TokenPayload = {} as TokenPayload;
  constructor(
    private empSuggestionService: EmpSuggestionService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.tokenPayload = this.tokenService.decodeToken(
      this.tokenService.getToken()!
    );
    this.getAllEmpSuggestions();
  }
  addSuggestion() {
    this.empSuggestionRequests.push({} as EmpSuggestionRequest);
  }

  deleteSuggestion(index: number) {
    if (this.empSuggestionRequests.length > 1) {
      this.empSuggestionRequests.splice(index, 1);
    }
  }
  createSuggestion() {
    console.log(this.empSuggestionRequests);
    let suggestionData: EmpSuggestionRequest[] = [];
    const hasEmptySuggestion = this.empSuggestionRequests.some(
      (req) => !req.suggestion || req.suggestion.trim() === ''
    );

    if (hasEmptySuggestion) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all suggestion fields before submitting',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    Object.entries(this.empSuggestionRequests).forEach(([id, data]) => {
      data.assessment_year = this.currentYear;
      suggestionData.push(data);
    });

    this.empSuggestionService
      .createSuggestion(this.empSuggestionRequests)
      .subscribe({
        next: (data) => {
          console.log(data);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Suggestion created successfully',
          });
          window.location.reload();
        },
        error: (err) => {
          console.error('Error creating suggestion: ', err);
        },
      });
    console.log(this.empSuggestionRequests);
  }
  getAllEmpSuggestions() {
    this.empSuggestionService
      .getByUserIdAndYear(this.tokenPayload.sub!, this.currentYear)
      .subscribe({
        next: (data) => {
          this.loading = false;
          console.log('THERE ARE ' + data.content.length + ' ITEMS');
          data.content.forEach((empSuggestion) => {
            this.empSuggestionRequests.push({
              id: empSuggestion.id,
              assessment_year: empSuggestion.assessment_year,
              suggestion: empSuggestion.suggestion,
            } as EmpSuggestionRequest);
          });
          if (this.empSuggestionRequests.length == 0) {
            this.empSuggestionRequests.push({
              assessment_year: this.currentYear,
              suggestion: '',
            } as EmpSuggestionRequest);
          }
          console.log(data);
        },
        error: (err) => {
          console.error('Error fetching emp suggestions:', err);
        },
      });
  }
}
