import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { AppService } from "../../app.service";

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
  selector: 'app-mark-attendance',
  templateUrl: './mark-attendance.component.html',
  styleUrls: ['./mark-attendance.component.scss']
})
export class MarkAttendanceComponent implements OnInit {
  @Input() mode: string;
  @Input() meetingList?: ReadonlyArray<Meeting> = [];
  @Input() userList: ReadonlyArray<User> = [];
  @Input() selectedMeeting: ReadonlyArray<Meeting> = [];

  listOfMeetings: string[] = [];

  checked = false;
  indeterminate = false;
  listOfCurrentPageData: ReadonlyArray<Meeting> = [];
  setOfCheckedId = new Set<number>();

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData.forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange(listOfCurrentPageData: ReadonlyArray<Meeting>): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData;
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  constructor(private modal: NzModalRef, private appService: AppService) { }

  ngOnInit(): void {
    this.selectedMeeting[0].attendance.forEach((user)=>{
      this.setOfCheckedId.add(user);
    });
  }

  closeModal() {
    this.modal.destroy();
  }

  markAttendance(){
    let meeting = this.selectedMeeting[0];
    meeting.attendance = Array.from(this.setOfCheckedId);
    this.appService.putMeeting(meeting).subscribe((res)=>{
      this.closeModal();
    });
  }
}
