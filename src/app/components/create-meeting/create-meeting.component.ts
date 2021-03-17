import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { AppService } from "../../app.service";

@Component({
  selector: 'app-create-meeting',
  templateUrl: './create-meeting.component.html',
  styleUrls: ['./create-meeting.component.scss']
})
export class CreateMeetingComponent implements OnInit {
  createMeetingForm: FormGroup;
  constructor(private fb: FormBuilder, private appService: AppService, private modal: NzModalRef) { }

  ngOnInit(): void {
    this.createMeetingForm = this.fb.group({
      meetingDate: [null, [Validators.required]],
      meetingTitle: [null, [Validators.required]]
    });
  }

  submitForm(): void {
    if (this.createMeetingForm.valid) {
      let formValues = { ...this.createMeetingForm.value };
      formValues.id = Date.now();
      formValues.attendance = [];
      this.appService.postMeeting(formValues).subscribe((res) => {
        this.modal.destroy();
      })
    } else {
      for (const i in this.createMeetingForm.controls) {
        this.createMeetingForm.controls[i].markAsDirty();
        this.createMeetingForm.controls[i].updateValueAndValidity();
      }
    }

  }

}
