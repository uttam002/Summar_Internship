import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { City } from 'src/app/model/cms.model';
import { AdminsideServiceService } from 'src/app/service/adminside-service.service';

@Component({
  selector: 'app-update-mission',
  templateUrl: './update-mission.component.html',
  styleUrls: ['./update-mission.component.css']
})
export class UpdateMissionComponent implements OnInit {
  missionId: any;
  editData: any;
  editMissionForm: FormGroup;
  formValid: boolean;
  countryList: any[] = [];
  cityList: any[] = [];
  imageUrl: any[] = [];
  missionImage: any = '';
  isFileUpload = false;
  isDocUpload = false;
  missionDocName: any;
  missionDocText: any;
  formData = new FormData();
  formDoc = new FormData();
  missionThemeList: any[] = [];
  missionSkillList: any[] = [];
  typeFlag = false;
  imageListArray: any[] = [];

  constructor(
    public fb: FormBuilder,
    public service: AdminsideServiceService,
    public toastr: ToastrService,
    public router: Router,
    public activateRoute: ActivatedRoute,
    public datePipe: DatePipe,
    private toast: NgToastService
  ) {
    this.missionId = this.activateRoute.snapshot.paramMap.get('Id');
    this.editMissionForm = this.fb.group({
      id: [''],
      missionTitle: ['', Validators.required],
      missionDescription: ['', Validators.required],
      countryId: ['', Validators.required],
      cityId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      totalSheets: [''],
      missionThemeId: ['', Validators.required],
      missionSkillId: ['', Validators.required],
      missionImages: ['']
    });

    if (this.missionId) {
      this.FetchDetail(this.missionId);
    }
  }

  ngOnInit(): void {
    this.CountryList();
    this.GetMissionSkillList();
    this.GetMissionThemeList();
    this.missionDocText = '';
  }

  CountryList() {
    this.service.CountryList().subscribe(
      (data: any) => {
        if (data.result === 1) {
          this.countryList = data.data;
        } else {
          this.toast.error({ detail: 'ERROR', summary: data.message, duration: 3000 });
        }
      },
      (error) => {
        this.toast.error({ detail: 'ERROR', summary: error.message, duration: 3000 });
      }
    );
  }

  CityList(countryId: any) {
    this.service.CityList(countryId).subscribe(
      (data: any) => {
        if (data.result === 1) {
          this.cityList = data.data;
        } else {
          this.toast.error({ detail: 'ERROR', summary: data.message, duration: 3000 });
        }
      },
      (error) => {
        this.toast.error({ detail: 'ERROR', summary: error.message, duration: 3000 });
      }
    );
  }

  HideOrShow(e: any) {
    this.typeFlag = e.target.value === 'Time';
  }

  GetMissionSkillList() {
    this.service.GetMissionSkillList().subscribe(
      (data: any) => {
        if (data.result === 1) {
          this.missionSkillList = data.data;
        } else {
          this.toast.error({ detail: 'ERROR', summary: data.message, duration: 3000 });
        }
      },
      (error) => {
        this.toast.error({ detail: 'ERROR', summary: error.message, duration: 3000 });
      }
    );
  }

  GetMissionThemeList() {
    this.service.GetMissionThemeList().subscribe(
      (data: any) => {
        if (data.result === 1) {
          this.missionThemeList = data.data;
        } else {
          this.toast.error({ detail: 'ERROR', summary: data.message, duration: 3000 });
        }
      },
      (error) => {
        this.toast.error({ detail: 'ERROR', summary: error.message, duration: 3000 });
      }
    );
  }

  async FetchDetail(id: any) {
    try {
      const data: any = await this.service.MissionDetailById(id).toPromise();
      this.editData = data.data;

      this.editData.startDate = this.datePipe.transform(this.editData.startDate, 'yyyy-MM-dd');
      this.editData.endDate = this.datePipe.transform(this.editData.endDate, 'yyyy-MM-dd');
      this.editData.registrationDeadLine = this.datePipe.transform(this.editData.registrationDeadLine, 'yyyy-MM-dd');

      this.editMissionForm.patchValue({
        id: this.editData.id,
        missionTitle: this.editData.missionTitle,
        missionDescription: this.editData.missionDescription,
        countryId: this.editData.countryId,
        cityId: this.editData.cityId,
        startDate: this.editData.startDate,
        endDate: this.editData.endDate,
        totalSheets: this.editData.totalSheets,
        missionThemeId: this.editData.missionThemeId,
        missionSkillId: this.editData.missionSkillId.split(','),
        missionImages: ''
      });

      const cityData: any = await this.service.CityList(this.editData.countryId).toPromise();
      this.cityList = cityData.data;

      if (this.editData.missionImages) {
        this.imageUrl = this.editData.missionImages.split(',');
        for (const photo of this.imageUrl) {
          this.imageListArray.push(this.service.imageUrl + '/' + photo.replaceAll('\\', '/'));
        }
      }
    } catch (error) {
      this.toast.error({ detail: 'ERROR', summary: error.message, duration: 3000 });
    }
  }

  // Form control getters
  get countryId() {return this.editMissionForm.get('countryId') as FormControl;}
  get cityId() {return this.editMissionForm.get('cityId') as FormControl;}
  get missionTitle() {return this.editMissionForm.get('missionTitle') as FormControl;}
  get missionDescription() {return this.editMissionForm.get('missionDescription') as FormControl;}
  get startDate() {return this.editMissionForm.get('startDate') as FormControl;}
  get endDate() {return this.editMissionForm.get('endDate') as FormControl;}
  get missionThemeId() {return this.editMissionForm.get('missionThemeId') as FormControl;}
  get missionSkillId() {return this.editMissionForm.get('missionSkillId') as FormControl;}
  get missionImages() {return this.editMissionForm.get('missionImages') as FormControl;}

  OnSelectedImage(event: any) {
    const files = event.target.files;
    if (this.imageListArray.length > 5) {
      return this.toast.error({ detail: 'ERROR', summary: 'Maximum 6 images can be added.', duration: 3000 });
    }
    if (files) {
      this.formData = new FormData();
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageListArray.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
      for (let i = 0; i < files.length; i++) {
        this.formData.append('file', files[i]);
        this.formData.append('moduleName', 'Mission');
      }
      this.isFileUpload = true;
    }
  }

  async OnSubmit() {
    this.formValid = true;
    const value = this.editMissionForm.value;
    const SkillLists = Array.isArray(value.missionSkillId) ? value.missionSkillId.join(',') : '';
    value.missionSkillId = SkillLists;

    if (this.editMissionForm.valid) {
      try {
        let updateImageUrl = '';
        if (this.isFileUpload) {
          const res: any = await this.service.UploadImage(this.formData).toPromise();
          if (res.success) {
            updateImageUrl = res.data;
          }
        }

        if (this.isFileUpload) {
          value.missionImages = updateImageUrl;
        } else {
          value.missionImages = this.editData.missionImages;
        }

        this.service.UpdateMission(value).subscribe(
          (data: any) => {
            if (data.result === 1) {
              this.toast.success({ detail: 'SUCCESS', summary: data.data, duration: 3000 });
              setTimeout(() => {
                this.router.navigate(['admin/mission']);
              }, 1000);
            } else {
              this.toastr.error(data.message);
            }
          },
          (error) => {
            this.toast.error({ detail: 'ERROR', summary: error.message, duration: 3000 });
          }
        );
      } catch (error) {
        this.toast.error({ detail: 'ERROR', summary: error.message, duration: 3000 });
      }
    }
  }

  OnCancel() {
    this.router.navigateByUrl('admin/mission');
  }

  OnRemoveImage(item: any) {
    const index: number = this.imageListArray.indexOf(item);
    if (index !== -1) {
      this.imageListArray.splice(index, 1);
    }
  }
}

