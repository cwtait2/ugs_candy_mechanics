import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ISubscription } from 'rxjs/Subscription';

import { StatusService } from '../../services/status.service';
import { FilesService } from '../../services/files.service';
import { WorkflowManagerService } from '../../services/workflow-manager.service';
import { FileUtils } from '../../file-utils';
import { Status } from '../../model/status';
import { StateEnum } from '../../model/state-enum';

@Component({
  selector: 'app-select-file',
  templateUrl: './select-file.component.html',
  styleUrls: ['./select-file.component.scss']
})
export class SelectFileComponent implements OnInit, OnDestroy {
  private statusSubscription: ISubscription;
  private status: Status;
  private _fileList: string[];
  private _processedFileList: string[];
  private _showNewFiles: boolean;


  constructor(private router: Router, private filesService:FilesService, private workflowManager:WorkflowManagerService, private statusService:StatusService) {
    this._showNewFiles = true;
  }

  ngOnInit() {
    this.filesService.getWorkspaceFiles().subscribe(fileList => {
      this._fileList = fileList;
    });

    this.filesService.getProcessedFiles().subscribe(processedFileList => {
      this._processedFileList = processedFileList;
    });

    this.status = new Status();
    this.statusSubscription = this.statusService.getStatus()
      .subscribe(data => {
        this.status = data;
      });

    let _start = document.getElementById('start');
    let _startBtn = document.getElementById('start-btn');
    let _step1 = document.getElementById('step-1');
    let _btnYes = document.getElementById('btn-yes');
    let _btnNo = document.getElementById('btn-no');
    let _step3 = document.getElementById('step-3');

    let _help = document.getElementById('help');
    let _staffBtnContainer = document.getElementById('staff-btn-container');

    let current = 0;

    let _backBtn = document.getElementById('back-btn');
    

    _startBtn.addEventListener('click', function(e) {
      e.preventDefault();
      _start.classList.remove("show");
      _step1.classList.add("show");
      current = 1;
    });

    _btnYes.addEventListener('click', function(e) {
      e.preventDefault();
      _step1.classList.remove("show");
      current = 2;
    });

     

    _backBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if(current === 1) {
        _start.classList.add("show");
        _step1.classList.remove("show");
        current = 0;
      } else if(current === 2) {
        _step1.classList.add("show");
        current = 1;
      }
    });

    _btnNo.addEventListener('click', showHelp);

    function showHelp(e) {
      e.preventDefault();
      _help.classList.add('show');
      _staffBtnContainer.classList.add('show');
    }

    

  }

  ngOnDestroy() {
  }

  selectFile(file: string) {
    this.workflowManager.setFile(file);
    this.router.navigate(['/load-chocolate']);
  }

  formatFilename(file: string): string {
    return FileUtils.convertFilename(file);
  }

  isReady(): boolean {
    return this.status !== undefined && (this.status.state == StateEnum.IDLE || this.status.state == StateEnum.ALARM);
  }

  get fileList(): string[] {
    return this._fileList;
  }

  get processedFileList(): string[] {
    return this._processedFileList;
  }

  get showNewFiles(): boolean {
    return this._showNewFiles;
  }

  set showNewFiles(show) {
    this._showNewFiles = show;
  }
}
