import { Component, OnInit } from '@angular/core';
import { GymOwnerAuthService } from '@core/authentication/gym-owner-auth.service';
import { GymOwnerHttpClient } from '@core/authentication/gym-owner-http.service';
import { AuthData } from '@core/authentication/interface';

@Component({
  selector: 'app-gym-owner-dashboard',
  template: `
    <div class="dashboard-container">
      
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <h1>Gym Owner Dashboard</h1>
          <div class="header-actions">
            <span class="welcome-text">Welcome, {{ currentUser?.userEmail }}</span>
            <button (click)="onLogout()" class="btn btn-outline">Logout</button>
          </div>
        </div>
      </header>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>

      <!-- Dashboard Content -->
      <div *ngIf="!loading" class="dashboard-content">
        
        <!-- User & Gym Info Cards -->
        <div class="info-cards">
          
          <!-- Gym Information Card -->
          <div class="info-card gym-info">
            <h3>Gym Information</h3>
            <div class="info-item">
              <label>Gym Name:</label>
              <span>{{ currentUser?.gymData?.name }}</span>
            </div>
            <div class="info-item">
              <label>Gym ID:</label>
              <span>{{ currentUser?.gymData?.gymId }}</span>
            </div>
            <div class="info-item">
              <label>Location:</label>
              <span>{{ currentUser?.gymData?.city }}, {{ currentUser?.gymData?.state }}</span>
            </div>
          </div>

          <!-- User Information Card -->
          <div class="info-card user-info">
            <h3>User Information</h3>
            <div class="info-item">
              <label>Email:</label>
              <span>{{ currentUser?.userEmail }}</span>
            </div>
            <div class="info-item">
              <label>Role:</label>
              <span>{{ currentUser?.userRole }}</span>
            </div>
            <div class="info-item">
              <label>User ID:</label>
              <span>{{ currentUser?.userId }}</span>
            </div>
          </div>

        </div>

        <!-- Statistics Cards -->
        <div class="stats-cards">
          <div class="stat-card">
            <h4>Total Players</h4>
            <div class="stat-number">{{ gymPlayers.length }}</div>
          </div>
          <div class="stat-card">
            <h4>Active Members</h4>
            <div class="stat-number">{{ getActiveMembers() }}</div>
          </div>
          <div class="stat-card">
            <h4>Monthly Revenue</h4>
            <div class="stat-number">$0</div>
          </div>
        </div>

        <!-- Players List -->
        <div class="players-section">
          <h3>Gym Players</h3>
          
          <div *ngIf="gymPlayers.length === 0" class="no-data">
            <p>No players found for this gym.</p>
            <button class="btn btn-primary">Add First Player</button>
          </div>

          <div *ngIf="gymPlayers.length > 0" class="players-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Membership</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let player of gymPlayers">
                  <td>{{ player.name || 'N/A' }}</td>
                  <td>{{ player.email || 'N/A' }}</td>
                  <td>{{ player.phone || 'N/A' }}</td>
                  <td>{{ player.membershipType || 'Basic' }}</td>
                  <td>
                    <span [class]="'status ' + (player.active ? 'active' : 'inactive')">
                      {{ player.active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm">Edit</button>
                    <button class="btn btn-sm btn-danger">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Actions Section -->
        <div class="actions-section">
          <h3>Quick Actions</h3>
          <div class="action-buttons">
            <button class="btn btn-primary">Add New Player</button>
            <button class="btn btn-secondary">Manage Memberships</button>
            <button class="btn btn-secondary">View Reports</button>
            <button (click)="refreshData()" class="btn btn-outline">Refresh Data</button>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .dashboard-header {
      background: white;
      border-bottom: 1px solid #e9ecef;
      padding: 1rem 0;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-content h1 {
      margin: 0;
      color: #333;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .welcome-text {
      color: #666;
    }

    .dashboard-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 200px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .info-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .info-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .info-card h3 {
      margin: 0 0 1rem 0;
      color: #333;
      border-bottom: 2px solid #007bff;
      padding-bottom: 0.5rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .info-item label {
      font-weight: 500;
      color: #666;
    }

    .info-item span {
      color: #333;
    }

    .stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }

    .stat-card h4 {
      margin: 0 0 0.5rem 0;
      color: #666;
      font-size: 0.9rem;
      text-transform: uppercase;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: #007bff;
    }

    .players-section {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .players-section h3 {
      margin: 0 0 1rem 0;
      color: #333;
    }

    .no-data {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .players-table table {
      width: 100%;
      border-collapse: collapse;
    }

    .players-table th,
    .players-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e9ecef;
    }

    .players-table th {
      background-color: #f8f9fa;
      font-weight: 500;
      color: #333;
    }

    .status {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .status.active {
      background-color: #d4edda;
      color: #155724;
    }

    .status.inactive {
      background-color: #f8d7da;
      color: #721c24;
    }

    .actions-section {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .actions-section h3 {
      margin: 0 0 1rem 0;
      color: #333;
    }

    .action-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      text-decoration: none;
      display: inline-block;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-outline {
      background-color: transparent;
      color: #007bff;
      border: 1px solid #007bff;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.8rem;
    }

    .btn:hover {
      opacity: 0.9;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
      }

      .info-cards,
      .stats-cards {
        grid-template-columns: 1fr;
      }

      .action-buttons {
        flex-direction: column;
      }

      .players-table {
        overflow-x: auto;
      }
    }
  `]
})
export class GymOwnerDashboardComponent implements OnInit {
  currentUser: AuthData | null = null;
  gymPlayers: any[] = [];
  loading = true;

  constructor(
    private authService: GymOwnerAuthService,
    private httpClient: GymOwnerHttpClient
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading = true;
    
    // Get current user data from storage
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      console.error('No current user found');
      this.loading = false;
      return;
    }

    console.log('Current User:', this.currentUser);
    console.log('Gym ID:', this.currentUser.gymId);
    console.log('User ID:', this.currentUser.userId);

    // Load gym players
    this.loadGymPlayers();
  }

  private loadGymPlayers(): void {
    this.httpClient.getGymPlayers().subscribe({
      next: (response) => {
        this.gymPlayers = response.players || [];
        this.loading = false;
        console.log('Gym Players:', this.gymPlayers);
      },
      error: (error) => {
        console.error('Error loading gym players:', error);
        this.gymPlayers = [];
        this.loading = false;
      }
    });
  }

  getActiveMembers(): number {
    return this.gymPlayers.filter(player => player.active).length;
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout successful');
        // Navigation is handled by the auth service
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }
}
