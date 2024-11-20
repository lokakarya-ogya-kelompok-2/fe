import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ManageDivisionService } from '../../manage-division.service';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-manage-division',
  standalone: true,
  imports: [CommonModule, TableModule, IconFieldModule, InputIconModule, InputTextModule, TagModule],
  templateUrl: './manage-division.component.html',
  styleUrl: './manage-division.component.scss'
})

export class ManageDivisionComponent implements OnInit{
posts:any[]=[];
constructor(private manageDivisionService: ManageDivisionService) {}

ngOnInit(): void {
  this.fetchPosts();
}

fetchPosts(): void {
  this.manageDivisionService.getPosts().subscribe({
    next: (data) => {
      this.posts = data;
      console.log('Data fetched:', data);
    },
    error: (err) => {
      console.error('Error fetching data:', err);
    },
  });
}
}
