import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';

import { StatusService } from '../services/status.service';
import { MachineService } from '../services/machine.service';
import { FilesService } from '../services/files.service';
import { Status } from '../model/status';
import { StateEnum } from '../model/state-enum';
import { FileUtils } from '../file-utils';
import { environment } from '../../environments/environment';

enum WorkflowStateEnum {
  WORKING = 'WORKING',
  STARTING = 'STARTING',
  KILLING_ALARM = 'KILLING_ALARM',
  HOMING = 'HOMING',
  MOVE_TO_ORIGIN = 'MOVE_TO_ORIGIN',
  MOVE_TO_EJECT = 'MOVE_TO_EJECT',
  SENDING = 'SENDING',
  FINISHED = 'FINISHED',
  EJECTING = 'EJECTING',
  ABORTED = 'ABORTED'
}

@Injectable({
  providedIn: 'root'
})
export class WorkflowManagerService {
  private file: string;
  private previousState: StateEnum;
  private workflowState: WorkflowStateEnum = WorkflowStateEnum.FINISHED;

  constructor(private router: Router, private statusService: StatusService, private machineService: MachineService,
    private filesService: FilesService) {
  }

  public setFile(file: string) {
    this.file = file;
  }

  public getFile(): string {
    return this.file;
  }

  public getName(): string {
    return FileUtils.convertFilename(this.file);
  }

  public start(): void {
    if (!this.isRunning()) {
      this.workflowState = WorkflowStateEnum.STARTING;
      this.previousState = StateEnum.UNKNOWN;

      // Subscribe to status changes
      this.statusService.getStatus()
        .subscribe(status => {

          // Check if the state has changed
          if (this.previousState !== status.state) {
            this.previousState = status.state;

            // If we changed the state to IDLE
            if (status.state === StateEnum.IDLE || status.state === StateEnum.ALARM) {
              this.changeToNextStep();
            }
          }
        });
    }
  }

  public stop(): Observable<any> {
    return this.filesService.cancel().pipe(
      tap(() => {
        this.workflowState = WorkflowStateEnum.ABORTED;
        this.previousState = StateEnum.UNKNOWN;
      })
    );
  }

  public changeToNextStep() {
    console.log('Ready for next step');
    const previousWorkflowState = this.workflowState;
    if ( previousWorkflowState === WorkflowStateEnum.STARTING) {
      this.killAlarm();
    } else if (previousWorkflowState === WorkflowStateEnum.KILLING_ALARM) {
      this.startHoming();
    } else if (previousWorkflowState === WorkflowStateEnum.HOMING) {
      this.moveToOrigin();
    } else if (previousWorkflowState === WorkflowStateEnum.MOVE_TO_ORIGIN) {
      this.sendFile();
    } else if (previousWorkflowState === WorkflowStateEnum.SENDING) {
      this.eject();
    } else if (previousWorkflowState === WorkflowStateEnum.EJECTING) {
      this.finishedSending();
    }
  }

  killAlarm() {
    console.log(' - Started killing alarm');
    this.workflowState = WorkflowStateEnum.WORKING;

    this.machineService.killAlarm().subscribe(() => {
      this.workflowState = WorkflowStateEnum.KILLING_ALARM;
      this.previousState = StateEnum.UNKNOWN;
    });
  }

  startHoming() {
    // Changing the state to let others know we are busy
    console.log(' - Started homing');
    this.workflowState = WorkflowStateEnum.WORKING;

    // Start homing
    this.machineService.homeMachine().subscribe(() => {
        this.workflowState = WorkflowStateEnum.HOMING;
      },
      (error) => {
        if (error.status === 412) {
          console.error(' - Homing is not activated on server');
          this.workflowState = WorkflowStateEnum.HOMING;
          this.previousState = StateEnum.UNKNOWN;
        } else {
          // TODO handle error
          console.error('Could not home machine!');
        }
      });
  }

  moveToOrigin() {
    // Changing the state to let others know we are busy
    console.log(' - Moving to origin');
    this.workflowState = WorkflowStateEnum.WORKING;

    this.machineService.sendCommands(environment.moveToOriginCommand).subscribe(() => {
      this.workflowState = WorkflowStateEnum.MOVE_TO_ORIGIN;
      this.previousState = StateEnum.UNKNOWN;
    },
    (error) => {
      console.error('Could not move to origin');
    });
  }

moveToEject() {
    // Changing the state to let others know we are busy
    console.log(' - Moving to Eject');
    this.workflowState = WorkflowStateEnum.WORKING;

    this.machineService.sendCommands(environment.moveToEjectCommand).subscribe(() => {
      this.workflowState = WorkflowStateEnum.MOVE_TO_EJECT;
      this.previousState = StateEnum.UNKNOWN;
    },
    (error) => {
      console.error('Could not move to eject');
    });
  }


  sendFile() {
    // Changing the state to let others know we are busy
    console.log(' - Sending file');
    this.workflowState = WorkflowStateEnum.WORKING;

    this.filesService.openWorkspaceFile(this.file).subscribe(() => {
      this.filesService.send().subscribe(() => {
        this.workflowState = WorkflowStateEnum.SENDING;
      },
      (error) => {
        console.error('Could not send file!');
      });
    },
    (error) => {
      console.error('Could not set file!');
    });
  }

  eject() {
    // Changing the state to let others know we are busy
    console.log(' - Ejecting');
    this.workflowState = WorkflowStateEnum.WORKING;

    this.machineService.sendCommands(environment.ejectCommand).subscribe(() => {
      this.workflowState = WorkflowStateEnum.EJECTING;
      this.previousState = StateEnum.UNKNOWN;
    },
    (error) => {
      console.error('Could not eject');
    });
  }

  finishedSending() {
    console.log(' - Finished sending');
    this.filesService.addProcessedFile(this.file);
    this.workflowState = WorkflowStateEnum.FINISHED;
    this.router.navigate(['/chocolate-finished']);
  }

  isRunning(): boolean {
    return this.workflowState !== WorkflowStateEnum.ABORTED && this.workflowState !== WorkflowStateEnum.FINISHED;
  }

  isSending(): boolean {
    return this.workflowState === WorkflowStateEnum.SENDING;
  }

  isHoming(): boolean {
    return this.workflowState === WorkflowStateEnum.HOMING;
  }

  isMovingToOrigin(): boolean {
    return this.workflowState === WorkflowStateEnum.MOVE_TO_ORIGIN;
  }

  isEjecting(): boolean {
    return this.workflowState === WorkflowStateEnum.EJECTING;
  }
}
