import { Component } from '@angular/core';
import { ManageGroupAttitudeSkillService } from '../../manage-group-attitude-skill.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-manage-group-attitude-skill',
  standalone: true,
  imports: [CommonModule, TableModule, IconFieldModule, InputIconModule, InputTextModule, TagModule, ButtonModule, DialogModule,ConfirmDialogModule, ToastModule],
  providers: [ManageGroupAttitudeSkillService],
  templateUrl: './manage-group-attitude-skill.component.html',
  styleUrl: './manage-group-attitude-skill.component.scss'
})
export class ManageGroupAttitudeSkillComponent {
  datas:any[]=[]
  loading: boolean = true;
  visible: boolean = false;
  editVisible: boolean = false;
  constructor(private manageGroupAttitudeSkillService: ManageGroupAttitudeSkillService) {}

  ngOnInit(): void {
    this.getAllData();
  }

  getAllData(): void {
    this.manageGroupAttitudeSkillService.getGroupAttitudeSkillss().subscribe({
      next: (data) => {
        this.datas = data.content;
        this.loading = false;
        console.log('Data fetched:', data.content);
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
  }

  showDialog() {
    this.visible = true;
  }
  showEditDialog(){
    this.editVisible = true;
  }
}
