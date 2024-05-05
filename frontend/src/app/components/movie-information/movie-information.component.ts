import { Component, Input, OnInit, inject } from '@angular/core';
import {Movie} from "../../interfaces/movie.interface";
import { AsyncPipe, JsonPipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-movie-information',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe
  ],
  templateUrl: './movie-information.component.html',
  styleUrl: './movie-information.component.css'
})
export class MovieInformationComponent implements OnInit {
  @Input({ required: true }) movie!: Movie;

  private sanitizer = inject(DomSanitizer);

  public youtubeUrl!: SafeResourceUrl;

  public ngOnInit(): void {
    this.youtubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/salY_Sm6mv4?si=rkHlfg17GnTAS4lz');
    // this.youtubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.movie.trailerUrl);
  }

}
