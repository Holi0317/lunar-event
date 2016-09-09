import {autoinject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {EventAggregator} from 'aurelia-event-aggregator';
import {SignIn} from './sign-in';
import {GoogleService} from './google-service';

@autoinject
export class App {
  constructor(
    private dialogService: DialogService,
    private googleService: GoogleService,
    private eventAggregator: EventAggregator
  ) {
    this.checkDialog = this.checkDialog.bind(this);
    this.eventAggregator.subscribeOnce('google-signin-changed', this.checkDialog);
  }

  checkDialog() {
    if (!this.googleService.isSignedIn) {
      this.dialogService.open({
        viewModel: SignIn
      })
    }
  }
}
