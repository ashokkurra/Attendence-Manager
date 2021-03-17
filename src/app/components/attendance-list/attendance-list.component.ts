import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AppService } from 'src/app/app.service';
import { CreateMeetingComponent } from "../create-meeting/create-meeting.component";
import { MarkAttendanceComponent } from "../mark-attendance/mark-attendance.component";

export interface Meeting {
  id: number;
  meetingDate: string;
  meetingTitle: string;
  attendance: number[];
}

export interface User {
  id: number;
  userName: string;
  password: string;
}

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.scss']
})
export class AttendanceListComponent implements OnInit {
  checked = false;
  indeterminate = false;
  meetingList: ReadonlyArray<Meeting> = [];
  listOfCurrentPageData: ReadonlyArray<Meeting> = [];
  setOfCheckedId = new Set<number>();
  userList: ReadonlyArray<User>;

  constructor(private modal: NzModalService, private viewContainerRef: ViewContainerRef, private appService: AppService, private message: NzMessageService) { }

  onCurrentPageDataChange(listOfCurrentPageData: ReadonlyArray<Meeting>): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData;
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.setOfCheckedId.clear();
    checked && this.setOfCheckedId.add(id);
    this.refreshCheckedStatus();
  }

  ngOnInit(): void {
    this.userList = JSON.parse(localStorage.getItem('users'));
    this.getMeetings();
  }

  getMeetings() {
    this.appService.getMeetings().subscribe((meetings) => {
      this.meetingList = meetings;
    });
  }

  createMeetingModal() {
    const modal = this.modal.create({
      nzTitle: 'Create Meeting',
      nzContent: CreateMeetingComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzFooter: [
        {
          label: 'Submit',
          onClick: componentInstance => {
            componentInstance.submitForm();
            this.message.create('success', 'Meeting Added Successfully');
          }
        }
      ]
    });
    modal.afterClose.subscribe(result => {
      this.getMeetings();
    });
  }

  markAttendance(): void {
    const requestData = this.meetingList.filter(data => this.setOfCheckedId.has(data.id));
    const modal = this.modal.create({
      nzTitle: 'Mark Attendance',
      nzContent: MarkAttendanceComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        mode: 'mark',
        meetingList: this.meetingList,
        userList: this.userList,
        selectedMeeting: requestData
      },
      nzFooter: [
        {
          label: 'Close',
          onClick: componentInstance => {
            componentInstance.closeModal();
          }
        },
        {
          label: 'Mark Attendance',
          onClick: componentInstance => {
            componentInstance.markAttendance();
            this.message.create('success', 'Attendance Marked Successfully');
          }
        }
      ]
    });
    modal.afterClose.subscribe(result => {
      this.getMeetings();
      this.setOfCheckedId.clear();
      this.refreshCheckedStatus();
    });
  }

  viewAttendance(data) {
    const modal = this.modal.create({
      nzTitle: 'View Attendance',
      nzContent: MarkAttendanceComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        mode: 'view',
        meetingList: this.meetingList,
        userList: this.userList,
        selectedMeeting: [data]
      },
      nzFooter: [
        {
          label: 'Close',
          onClick: componentInstance => {
            componentInstance.closeModal();
          }
        }
      ]
    });
    modal.afterClose.subscribe(result => {
      this.setOfCheckedId.clear();
      this.refreshCheckedStatus();
    });
  }
}
