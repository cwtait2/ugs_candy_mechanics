import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { WorkflowManagerService } from '../../services/workflow-manager.service';

@Component({
  selector: 'app-load-chocolate',
  templateUrl: './load-chocolate.component.html',
  styleUrls: ['./load-chocolate.component.scss']
})
export class LoadChocolateComponent implements OnInit, OnDestroy {

  constructor(private workflowManager: WorkflowManagerService) { }

  ngOnInit() {

    const _video = document.getElementById('video');

    const _step3 = document.getElementById('step-3');
    const _step4 = document.getElementById('step-4');

    const _btnNo = document.getElementById('btn-no');
    const _help = document.getElementById('help');
    const _staffBtnContainer = document.getElementById('staff-btn-container');

    _video.onended = function() {
      _step3.classList.remove("show");
      _step4.classList.add("show");
    }

    _video.addEventListener('click', function(e) {
      e.preventDefault();
      _step3.classList.remove("show");
      _step4.classList.add("show");
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

  getName(): string {
    return this.workflowManager.getName();
  }
}
