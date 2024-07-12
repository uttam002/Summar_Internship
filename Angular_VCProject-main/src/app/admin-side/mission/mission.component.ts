import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ToastrService } from 'ngx-toastr';
import { AdminsideServiceService } from 'src/app/service/adminside-service.service';
declare var window: any;

@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.css']
})
export class MissionComponent implements OnInit {
  deleteModal: any;
  missionList: any[] = [];
  page: number = 1;
  itemsPerPages = 10;
  searchText: any = '';
  missionId: any;
  useLocalData: boolean = true; // Set this to false to fetch data from an external database

  // Local example data
  localData = [
    { id: 1, missionTitle: 'Mission One', missionType: 'Type A', startDate: new Date('2023-01-01'), endDate: new Date('2023-02-01') },
    { id: 2, missionTitle: 'Mission Two', missionType: 'Type B', startDate: new Date('2023-03-01'), endDate: new Date('2023-04-01') },
    { id: 3, missionTitle: 'Mission Three', missionType: 'Type C', startDate: new Date('2023-05-01'), endDate: new Date('2023-06-01') }
  ];

  constructor(
    public service: AdminsideServiceService,
    public toastr: ToastrService,
    public router: Router,
    private toast: NgToastService
  ) { }

  ngOnInit(): void {
    this.loadMissions();
    this.deleteModal = new window.bootstrap.Modal(document.getElementById('removeMissionModal'));
  }

  loadMissions() {
    if (this.useLocalData) {
      this.missionList = [...this.localData];
    } else {
      this.FetchData();
    }
  }

  FetchData() {
    this.service.MissionList().subscribe((data: any) => {
      if (data.result == 1) {
        this.missionList = data.data;
        this.missionList = this.missionList.map(x => {
          return {
            id: x.id,
            missionTitle: x.missionTitle,
            missionDescription: x.missionDescription,
            missionOrganisationName: x.missionOrganisationName,
            missionOrganisationDetail: x.missionOrganisationDetail,
            countryId: x.countryId,
            cityId: x.cityId,
            missionType: x.missionType,
            startDate: x.startDate,
            endDate: x.endDate,
            totalSheets: x.totalSheets,
            registrationDeadLine: x.registrationDeadLine,
            missionTheme: x.missionTheme,
            missionSkill: x.missionSkill,
            missionImages: x.missionImages ? this.service.imageUrl + '/' + x.missionImages : 'assets/NoImg.png',
            missionDocuments: x.missionDocuments,
            missionAvilability: x.missionAvilability
          };
        });
      } else {
        this.toast.error({ detail: "ERROR", summary: data.message, duration: 3000 });
      }
    }, err => this.toast.error({ detail: "ERROR", summary: err.error.message, duration: 3000 }));
  }

//Modify here
  OpenRemoveMissionModal(id: any) {
    this.deleteModal.show();
    this.missionId = id;
  }

  CloseRemoveMissionModal() {
    this.deleteModal.hide();
  }

  DeleteMissionData() {
    if (this.useLocalData) {
      this.localData = this.localData.filter(mission => mission.id !== this.missionId);
      this.missionList = [...this.localData];
      this.toast.success({ detail: "SUCCESS", summary: "Mission deleted successfully.", duration: 3000 });
      this.CloseRemoveMissionModal();
    } else {
      this.service.DeleteMission(this.missionId).subscribe((data: any) => {
        if (data.result == 1) {
          this.toast.success({ detail: "SUCCESS", summary: data.data, duration: 3000 });
          setTimeout(() => {
            this.deleteModal.hide();
            this.loadMissions(); // Refresh the list after deletion
          }, 1000);
        } else {
          this.toast.error({ detail: "ERROR", summary: data.message, duration: 3000 });
        }
      }, err => this.toast.error({ detail: "ERROR", summary: err.message, duration: 3000 }));
    }
  }
}
