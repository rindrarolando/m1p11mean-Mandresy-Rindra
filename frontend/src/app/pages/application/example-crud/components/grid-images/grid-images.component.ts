import { Component, Input } from '@angular/core'
import { Router } from '@angular/router'
import { environment } from '../../../../../../environments/environment'

@Component({
  selector: 'app-grid-images',
  templateUrl: './grid-images.component.html',
  styleUrls: ['./grid-images.component.css']
})
export class GridImagesComponent {

  @Input() items: any
  @Input() columns: any
  @Input() link: any
  @Input() filter: any
  @Input() itemsCount: any
  @Input() pagination: any
  backendDomain: string = environment.backendDomain

  constructor(public router: Router) { }

  selectItem(id: any): void {
    this.router.navigate(['/crud/' + this.link, id])
  }

}
