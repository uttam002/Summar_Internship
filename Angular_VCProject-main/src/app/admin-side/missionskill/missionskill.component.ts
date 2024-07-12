import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AdminsideServiceService } from 'src/app/service/adminside-service.service';
declare var window: any;

@Component({
  selector: 'app-missionskill',
  templateUrl: './missionskill.component.html',
  styleUrls: ['./missionskill.component.css']
})
export class MissionskillComponent implements OnInit {
  deleteSkillmodal: any;
  missionSkillList: any[] = [];
  page: number = 1;
  itemsPerPages: number = 10;
  searchText: any = '';
  skillId: any;
  useLocalData: boolean = true; // Set this to false to fetch data from an external database

  // Local example data
  localData = [
    { id: 1, skillName: 'Skill One', skillDescription: 'Description for Skill One' },
    { id: 2, skillName: 'Skill Two', skillDescription: 'Description for Skill Two' },
    { id: 3, skillName: 'Skill Three', skillDescription: 'Description for Skill Three' }
  ];

  constructor(private service: AdminsideServiceService, private route: Router, private toast: NgToastService) { }

  ngOnInit(): void {
    this.loadMissionSkills();
    this.deleteSkillmodal = new window.bootstrap.Modal(document.getElementById('removeMissionSkillModal'));
  }

  loadMissionSkills() {
    if (this.useLocalData) {
      this.missionSkillList = [...this.localData];
    } else {
      this.GetMissionSkillList();
    }
  }

  GetMissionSkillList() {
    this.service.MissionSkillList().subscribe((data: any) => {
      if (data.result === 1) {
        this.missionSkillList = data.data;
      } else {
        this.toast.error({ detail: "ERROR", summary: data.message, duration: 3000 });
      }
    }, err => this.toast.error({ detail: "ERROR", summary: err.message, duration: 3000 }));
  }

  // Modify here for Removed delete & edit button at mission skill
  OpenDeleteSkillModal(id: any) {
    this.deleteSkillmodal.show();
    this.skillId = id;
  }

  CloseDeleteSkillModal() {
    this.deleteSkillmodal.hide();
  }

  DeleteSkillData() {
    if (this.useLocalData) {
      this.localData = this.localData.filter(skill => skill.id !== this.skillId);
      this.missionSkillList = [...this.localData];
      this.toast.success({ detail: "SUCCESS", summary: "Skill deleted successfully.", duration: 3000 });
      this.CloseDeleteSkillModal();
    } else {
      this.service.DeleteMissionSkill(this.skillId).subscribe((data: any) => {
        if (data.result === 1) {
          this.toast.success({ detail: "SUCCESS", summary: data.data, duration: 3000 });
          setTimeout(() => {
            this.CloseDeleteSkillModal();
            this.loadMissionSkills(); // Refresh the list after deletion
          }, 1000);
        } else {
          this.toast.error({ detail: "ERROR", summary: data.message, duration: 3000 });
        }
      }, err => this.toast.error({ detail: "ERROR", summary: err.message, duration: 3000 }));
    }
  }
}
