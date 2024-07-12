import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { AdminsideServiceService } from 'src/app/service/adminside-service.service';
declare var window: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  page: number = 1;
  itemsPerPages: number = 10;
  searchText: any = '';
  userList: any[] = [];
  deleteModal: any;
  userId: any;
  useLocalData: boolean = true; // Set this to false to fetch data from an external database

  // Local example data
  localData = [
    { id: 1, name: 'Uttam', surname: 'Bhuva', emailAddress: 'officialwebset@gmail.com', employeeId: 'E001', department: 'CE', status: true },
    { id: 2, name: 'Hemant', surname: 'Pithdiya', emailAddress: 'hemnatp@gmail.com', employeeId: 'E002', department: 'IT', status: false },
    { id: 3, name: 'Dhaval', surname: 'Modhavadiya', emailAddress: 'dbmodhavadiya@outlook.com', employeeId: 'E003', department: 'Finance', status: true }
  ];

  constructor(private service: AdminsideServiceService, private toast: NgToastService) { }

  ngOnInit(): void {
    this.loadUsers();
    this.deleteModal = new window.bootstrap.Modal(
      document.getElementById('removeMissionModal')
    );
  }

  loadUsers() {
    if (this.useLocalData) {
      this.userList = [...this.localData];
    } else {
      this.FetchUserList();
    }
  }

  FetchUserList() {
    this.service.UserList().subscribe((data: any) => {
      if (data.result == 1) {
        this.userList = data.data;
      } else {
        this.toast.error({ detail: "ERROR", summary: data.message, duration: 3000 });
      }
    }, err => this.toast.error({ detail: "ERROR", summary: err.error.message, duration: 3000 }));
  }

  OpenRemoveUserModal(id: any) {
    this.deleteModal.show();
    this.userId = id;
  }

  CloseRemoveMissionModal() {
    this.deleteModal.hide();
    this.userId = null;
  }

  DeleteUser() {
    if (this.userId !== null) {
      if (this.useLocalData) {
        this.localData = this.localData.filter(user => user.id !== this.userId);
        this.userList = [...this.localData];
        this.toast.success({ detail: "SUCCESS", summary: "User deleted successfully.", duration: 3000 });
        this.CloseRemoveMissionModal();
      } else {
        this.service.DeleteUser(this.userId).subscribe((data: any) => {
          if (data.result == 1) {
            this.toast.success({ detail: "SUCCESS", summary: data.data, duration: 3000 });
            setTimeout(() => {
              this.deleteModal.hide();
              this.loadUsers(); // Refresh the list after deletion
            }, 1000);
          } else {
            this.toast.error({ detail: "ERROR", summary: data.message, duration: 3000 });
          }
        }, err => this.toast.error({ detail: "ERROR", summary: err.error.message, duration: 3000 }));
      }
    }
  }
}

// import { Component, OnInit } from '@angular/core';
// import { data } from 'jquery';
// import { NgToastService } from 'ng-angular-popup';
// import { AdminsideServiceService } from 'src/app/service/adminside-service.service';
// declare var window:any;
// @Component({
//   selector: 'app-user',
//   templateUrl: './user.component.html',
//   styleUrls: ['./user.component.css']
// })
// export class UserComponent implements OnInit {
//   page: number = 1;
//   itemsPerPages: number = 10;
//   searchText:any='';
//   userList:any[]=[];
//   deleteModal:any;
//   userId:any;
//   constructor(private service:AdminsideServiceService,private toast:NgToastService) { }

//   ngOnInit(): void {
//     this.FetchUserList();
//     this.deleteModal = new window.bootstrap.Modal(
//       document.getElementById('removeMissionModal')
//     );
//   }
//   FetchUserList(){
//     this.service.UserList().subscribe((data:any)=>{
//       if(data.result == 1)
//       {
//         this.userList = data.data;
//       }
//       else
//       {
//         this.toast.error({detail:"ERROR",summary:data.message,duration:3000});
//       }
//     },err=>this.toast.error({detail:"ERROR",summary:err.error.message,duration:3000}));
//   }


//   CloseRemoveMissionModal(){
//     this.deleteModal.hide();
//   }
//   DeleteUser(){
//     this.service.DeleteUser(this.userId).subscribe((data:any)=>{
//       if(data.result == 1)
//       {
//           this.toast.success({detail:"SUCCESS",summary:data.data,duration:3000});
//           setTimeout(() => {
//             this.deleteModal.hide();
//           window.location.reload();
//           }, 1000);
//       }
//       else{
//           this.toast.error({detail:"ERROR",summary:data.message,duration:3000});
//       }
//     },err=>this.toast.error({detail:"ERROR",summary:err.error.message,duration:3000}))
//   }

// }
