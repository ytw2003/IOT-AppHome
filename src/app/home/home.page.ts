import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage  implements OnInit, OnDestroy{
  lampIcon: string = 'bulb';
  lampColor: string = 'gray';

  apiUrl: string = environment.apiRepl;
  intervalId: any;

  constructor(private http: HttpClient){};

  ngOnInit() {
    this.startPolling();
  }

  ngOnDestroy() {
    if(this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startPolling() {
    this.intervalId = setInterval(() => {
      this.getLampStatus();
    }, 5000)
  }

  getLampStatus() {
    console.log('getLampStatus called');

    this.http.get<{
      status: string, data: { command: string } []
    }> (this.apiUrl).subscribe(
      response => {
        console.log('Api Response: ', response);
        if(response.status === 'success' && response.data.length > 0) {
          const command = response.data[0].command;
          this.updateLampColor(command);
        }
      },
      error => {
        console.error('Api Error: ', error );
      }
    );
  }

  updateLampColor(command: string) {
    console.log('updateLampColor called with command: ', command);

    switch(command) {
      case 'Nyalakan Lampu Merah':
        this.lampColor = 'red';
        break;
      case 'Nyalakan Lampu Biru':
        this.lampColor = 'blue';
        break;
      case 'Nyalakan Lampu Hijau':
        this.lampColor = 'green';
        break;
      case 'Matikan Lampu ':
        default:
        this.lampColor = 'grey'
        break;
    }
    console.log('Lamp Color Updated to: ', this.lampColor);
  }
}