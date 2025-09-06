import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../services/client.service';
import { TokenService } from 'app/service/token.service';

@Component({
  selector: 'app-players-list',
  templateUrl: './players-list.component.html',
  styleUrl: './players-list.component.scss'
})
export class PlayersListComponent implements OnInit {

  constructor(
    private clientService: ClientService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.loadPlayers();
  }

  // Add your players list logic here
  players: any[] = [];
  displayedColumns: string[] = ['name', 'email', 'phone', 'membership', 'actions'];

  loadPlayers(): void {
    const userSession = this.tokenService.getUserSession();
    this.clientService.getPlayersListByGymId(userSession?.gymId).subscribe({
      next: (res: any) => {
        console.log(res, '==players list');
        this.players = res;
      },
      error: (err) => console.error('Failed to fetch players list', err)
    });
  }

  addPlayer(): void {
    // Navigate to add player form or open dialog
    console.log('Add player functionality');
  }

  editPlayer(player: any): void {
    // Navigate to edit player form or open dialog
    console.log('Edit player:', player);
  }

  deletePlayer(playerId: number): void {
    // Implement delete player logic
    console.log('Delete player:', playerId);
  }

}
