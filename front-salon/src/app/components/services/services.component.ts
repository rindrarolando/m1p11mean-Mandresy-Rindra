import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  
  services = [
    { id: '1', name: 'Haircut', description: 'Professional haircut services', price: 50 },
    { id: '2', name: 'Coloring', description: 'High-quality hair coloring', price: 70 },
    { id: '3', name: 'Styling', description: 'Trendy hair styling', price: 40 },
    { id: '4', name: 'Manicure', description: 'Nail shaping and polish', price: 30 },
    { id: '5', name: 'Pedicure', description: 'Relaxing foot treatments', price: 35 }
    // Add more services as needed
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
