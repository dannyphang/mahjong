import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {
  items: MenuItem[] = [];
  home: MenuItem = {
    routerLink: 'home',
  };
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.buildBreadCrumbs();
      });
    this.buildBreadCrumbs();
  }

  buildBreadCrumbs() {
    this.items = [];
    let currentRoute = this.activatedRoute.root.children[0] as ActivatedRoute | null,
      url = '';
    let lastItem = '';
    do {
      const childrenRoutes = currentRoute?.children;
      currentRoute = null;
      childrenRoutes?.forEach((route) => {
        if (route.outlet === 'primary' && route.snapshot?.data?.['title']) {
          const routeSnapshot = route.snapshot;
          if (lastItem != routeSnapshot.data['title']) {
            lastItem = routeSnapshot.data['title'];
            url +=
              '/' + routeSnapshot.url.map((segment) => segment.path).join('/');
            this.items.push({
              label: this.translateService.instant(routeSnapshot.data['title']),
              routerLink: url,
            });
          }
          currentRoute = route;
        }
      });
    } while (currentRoute);
  }
}
