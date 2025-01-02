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
  currentYear: number = new Date().getFullYear();
  empSuggestionRequests: EmpSuggestionRequest[] = [];
  tokenPayload: TokenPayload = {} as TokenPayload;
  isEditing: { [key: string]: boolean } = {};
  originalValues: { [key: string]: string } = {};
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
    const id = this.empSuggestionRequests[index].id;
    if (id) {
      Swal.fire({
        icon: 'question',
        title: 'Are you sure?',
        showCancelButton: true,
        cancelButtonText: 'No',
        confirmButtonText: 'Yes',
        customClass: {
          container: 'z-9999',
        },
      }).then((res) => {
        if (res.isConfirmed) {
          this.empSuggestionService.delete(id).subscribe({
            next: (data) => {
              Swal.fire({
                icon: 'success',
                title: 'Delete successful!',
                text: data.message,
                customClass: {
                  container: 'z-9999',
                },
              });
              this.empSuggestionRequests.splice(index, 1);
            },
            error: (err) => {
              Swal.fire({
                icon: 'error',
                title: 'Delete failed!',
                text: err.error.message,
                customClass: {
                  container: 'z-9999',
                },
              });
            },
          });
        }
      });
    } else {
      this.empSuggestionRequests.splice(index, 1);
    }
  }
  createSuggestion() {
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

    suggestionData = this.empSuggestionRequests
      .filter((empSu) => !empSu.id)
      .map((empSu) => {
        empSu.assessment_year = this.currentYear;
        return empSu;
      });

    this.empSuggestionService.createSuggestion(suggestionData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Suggestion created successfully',
        });
        this.getAllEmpSuggestions();
      },
      error: (err) => {
        console.error('Error creating suggestion: ', err);
      },
    });
  }

  getAllEmpSuggestions() {
    this.empSuggestionRequests = [];
    this.empSuggestionService
      .list({
        user_ids: [this.tokenPayload.sub!],
        years: [this.currentYear],
      })
      .subscribe({
        next: (data) => {
          this.loading = false;
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
        },
        error: (err) => {
          console.error('Error fetching emp suggestions:', err);
        },
      });
  }

  update(ix: number) {
    this.empSuggestionService.update(this.empSuggestionRequests[ix]).subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Update successful!',
          icon: 'success',
          text: data.message,
          customClass: {
            container: 'z-9999',
          },
        });
        this.empSuggestionRequests[ix].suggestion = data.content.suggestion;
        this.isEditing[data.content.id] = false;
      },
      error: (err) => {
        Swal.fire({
          title: 'Update failed!',
          icon: 'error',
          text: err.error.message,
          customClass: {
            container: 'z-9999',
          },
        });
      },
    });
  }

  startEditMode(ix: number) {
    this.isEditing[this.empSuggestionRequests[ix].id!] = true;
    this.originalValues[this.empSuggestionRequests[ix].id!] =
      this.empSuggestionRequests[ix].suggestion;
  }

  cancelEditMode(ix: number) {
    this.isEditing[this.empSuggestionRequests[ix].id!] = false;
    this.empSuggestionRequests[ix].suggestion =
      this.originalValues[this.empSuggestionRequests[ix].id!];
  }

  submissible = () => this.empSuggestionRequests.some((empSu) => !empSu.id);
}
