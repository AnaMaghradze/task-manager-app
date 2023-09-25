/*
 * The decorator is used to automatically destroy subscriptions inside a component.
 * Source: https://medium.com/@sniadek97/auto-unsubscribe-in-angular-bcda939d6158
 */
export function AutoDestroy(component: any, key: string | symbol): void {
  const originalOnDestroy = component.ngOnDestroy;

  component.ngOnDestroy = function () {
    if (originalOnDestroy) {
      originalOnDestroy.call(this);
    }
    this[key].next();
    this[key].complete();
  };
}
