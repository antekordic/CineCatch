import {Component, inject, OnInit} from '@angular/core';
import {map, Observable, of, switchMap} from "rxjs";
import {ActivatedRoute, RouterModule} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

}

// https://www.youtube.com/watch?v=Dvqe0uIhBxQ