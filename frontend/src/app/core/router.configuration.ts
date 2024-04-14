import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  RouteReuseStrategy,
} from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }
  store(
    route: ActivatedRouteSnapshot,
    detachedTree: DetachedRouteHandle
  ): void {}
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return null;
  }
  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    const neverReuseUrls = ['search-results'];
    const futureUrl = future.routeConfig ? future.routeConfig.path : '';

    console.log(neverReuseUrls, futureUrl);

    if (futureUrl == null) {
      return false;
    }

    if (neverReuseUrls.includes(futureUrl)) {
      return false;
    }

    return future.routeConfig === curr.routeConfig;
  }
}
