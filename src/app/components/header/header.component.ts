import { Component, OnInit } from '@angular/core';

import { StatusService } from '../../services/status.service';
import { Status } from '../../model/status';
import { StateEnum } from '../../model/state-enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private statusService: StatusService) { }

  ngOnInit() {

    const _helpBtn = document.getElementById('help-btn');
    const _help = document.getElementById('help');
    const _staffBtnContainer = document.getElementById('staff-btn-container');
    const _staffBtn = document.getElementById('staff-btn');

    _helpBtn.addEventListener('click', function(e) {
  	  e.preventDefault();
  	  _help.classList.add('show');
  	  _staffBtnContainer.classList.add('show');
    });

    _staffBtn.addEventListener('click', function(e) {
      _help.classList.remove('show');
      _staffBtnContainer.classList.remove('show');
    });

    _help.addEventListener('click', hideHelp);

    function hideHelp(e) {
      e.preventDefault();
      _help.classList.remove('show');
      _staffBtnContainer.classList.remove('show');
    }
  }
}
