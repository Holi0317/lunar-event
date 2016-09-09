import {autoinject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DialogService} from 'aurelia-dialog';
import {DialogController} from 'aurelia-dialog';
import {GoogleService} from './google-service';

@autoinject
export class SignIn {
  constructor(
    private googleService: GoogleService,
    private eventAggregator: EventAggregator,
    private dialogController: DialogController,
    private dialogService: DialogService
  ) {
    this.changed = this.changed.bind(this);
    this.eventAggregator.subscribe('google-signin-changed', this.changed);
  }

  login() {
    this.googleService.login();
  }

  changed() {
    if (this.googleService.isSignedIn) {
      this.dialogController.ok();
    } else {
      this.dialogService.open({
        viewModel: SignIn
      })
    }
  }
}