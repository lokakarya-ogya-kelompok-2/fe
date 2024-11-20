import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MainService } from '../../main.service';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent implements OnInit {
posts:any[]=[];

constructor(private mainService: MainService) {}

ngOnInit(): void {
  this.fetchPosts();
}

fetchPosts(): void {
  this.mainService.getPosts().subscribe({
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
