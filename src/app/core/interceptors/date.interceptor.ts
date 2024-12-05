import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';

export const dateInterceptor: HttpInterceptorFn = (req, next) => {
  const dateFields = ['created_at', 'updated_at'];
  const transformDates = (body: any): any => {
    if (!body) return body;
    if (typeof body === 'object') {
      for (const key of Object.keys(body)) {
        if (dateFields.includes(key) && body[key]) {
          body[key] = new Date(body[key]);
        } else if (typeof body[key] === 'object') {
          body[key] = transformDates(body[key]);
        }
      }
    }
    return body;
  };
  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse) {
        return event.clone({
          body: transformDates(event.body),
        });
      }
      return event;
    })
  );
};
