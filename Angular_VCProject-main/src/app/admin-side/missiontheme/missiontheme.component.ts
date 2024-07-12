import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AdminsideServiceService } from 'src/app/service/adminside-service.service';
declare var window: any;

@Component({
  selector: 'app-missiontheme',
  templateUrl: './missiontheme.component.html',
  styleUrls: ['./missiontheme.component.css'],
})
export class MissionthemeComponent implements OnInit {
  missionThemeList: any[] = [];
  page: number = 1;
  itemsPerPages: number = 10;
  searchText: any;
  themeId: any;
  deleteThemeModal: any;
  useLocalData: boolean = true; // Set this to false to fetch data from an external database

  // Local example data
  localData = [
    { id: 1, themeName: 'Theme One', themeDescription: 'Description for Theme One' },
    { id: 2, themeName: 'Theme Two', themeDescription: 'Description for Theme Two' },
    { id: 3, themeName: 'Theme Three', themeDescription: 'Description for Theme Three' }
  ];

  constructor(
    private service: AdminsideServiceService,
    private router: Router,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.loadMissionThemes();
    this.deleteThemeModal = new window.bootstrap.Modal(
      document.getElementById('removemissionThemeModal')
    );
  }

  loadMissionThemes() {
    if (this.useLocalData) {
      this.missionThemeList = [...this.localData];
    } else {
      this.getMissionThemeList();
    }
  }

  getMissionThemeList() {
    this.service.MissionThemeList().subscribe(
      (data: any) => {
        if (data.result === 1) {
          this.missionThemeList = data.data;
        } else {
          this.toast.error({ summary: data.message, duration: 3000 });
        }
      },
      (err) => this.toast.error({ summary: err.message, duration: 3000 })
    );
  }
// Modify here for delete & edit button from mission theme

  OpenDeleteThemeModal(themeId: any) {
    this.themeId = themeId;
    this.deleteThemeModal.show();
  }

  CloseRemoveMissionThemeModal() {
    this.deleteThemeModal.hide();
  }

  DeleteMissionTheme() {
    if (this.useLocalData) {
      this.localData = this.localData.filter(theme => theme.id !== this.themeId);
      this.missionThemeList = [...this.localData];
      this.toast.success({ detail: 'SUCCESS', summary: 'Theme deleted successfully.', duration: 3000 });
      this.CloseRemoveMissionThemeModal();
    } else {
      this.service.DeleteMissionTheme(this.themeId).subscribe(
        (data: any) => {
          if (data.result === 1) {
            this.toast.success({ detail: 'SUCCESS', summary: data.data, duration: 3000 });
            setTimeout(() => {
              this.CloseRemoveMissionThemeModal();
              this.loadMissionThemes(); // Refresh the list after deletion
            }, 1000);
          } else {
            this.toast.error({ summary: data.message, duration: 3000 });
          }
        },
        (err) => this.toast.error({ summary: err.message, duration: 3000 })
      );
    }
  }
}
