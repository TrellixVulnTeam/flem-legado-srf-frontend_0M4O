import { OnInit, Directive, ElementRef, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { UserDataService } from '../service/user-data.service';

@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective implements OnInit {
  private currentUser;
  private permissions = [];
  private permissao;

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userService: UserDataService
  ) {
  }

  ngOnInit() {
    this.permissions = this.userService.permissions();
  }

  @Input()
  set hasPermission(val) {
    this.permissao = val;
    this.updateView();
  }

  private updateView() {
    if (this.checkPermission()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  private checkPermission() {
    let hasPermission = false;
    this.permissions = this.userService.permissions();
    for (const checkPermission of this.permissao) {
      const permissionFound = this.permissions.find(x => x.toUpperCase() === checkPermission.toUpperCase());
      if (permissionFound) {
        hasPermission = true;
      }
    }

    return hasPermission;
  }
}