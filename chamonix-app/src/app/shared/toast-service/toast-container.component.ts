import { Component, TemplateRef } from '@angular/core';
import { ToastService } from './toast.service';


@Component({
  selector: 'app-toasts',
  templateUrl: './toast-container.component.html',
  host: {'[class.ngb-toasts]': 'true'},
  styleUrls: ['./toast-container.component.scss']
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}

  isTemplate(toast: any) { return toast.textOrTpl instanceof TemplateRef; }
}
