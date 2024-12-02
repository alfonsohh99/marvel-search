import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, MatToolbarModule, MatIconModule, MatButtonModule,MatSidenavModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  
})
export class LayoutComponent {

}
