import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import Swal from 'sweetalert2';
import { TokenService } from '../../../../core/services/token.service';
import { User } from '../../../users/models/user';
import { EmpSuggestionRequest } from '../../models/emp-suggestion';
import { EmpSuggestionService } from '../../services/emp-suggestion.service';
@Component({
  selector: 'app-suggestion',
  standalone: true,
  imports: [CardModule, CommonModule, FormsModule, ButtonModule],
  templateUrl: './suggestion.component.html',
  styleUrl: './suggestion.component.scss',
})
export class SuggestionComponent {
  suggestions: string[] = [''];
  userId: string = '';
  currentYear: number = new Date().getFullYear();
  empSuggestionRequest: EmpSuggestionRequest[] = [
    { suggestion: '', user_id: '', assessment_year: this.currentYear },
  ];
  currentUser: User = {} as User;
  constructor(
    private empSuggestionService: EmpSuggestionService,
    private tokenService: TokenService
  ) {}
  addSuggestion() {
    this.empSuggestionRequest.push({} as EmpSuggestionRequest);
  }

  deleteSuggestion(index: number) {
    if (this.empSuggestionRequest.length > 1) {
      this.empSuggestionRequest.splice(index, 1);
    }
  }
  createSuggestion() {
    console.log(this.empSuggestionRequest);
    let suggestionData: EmpSuggestionRequest[] = [];
    const hasEmptySuggestion = this.empSuggestionRequest.some(
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

    Object.entries(this.empSuggestionRequest).forEach(([id, data]) => {
      data.assessment_year = this.currentYear;
      suggestionData.push(data);
    });
    console.log(suggestionData);

    this.empSuggestionService
      .createSuggestion(this.empSuggestionRequest)
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
    console.log(this.empSuggestionRequest);
  }
}
