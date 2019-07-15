import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { PreloaderService } from './shared/components/preloader/preloader.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

    constructor(
        private preloader: PreloaderService
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const usePreloader = req.headers.get('preloader') !== 'false';
        if (usePreloader) {
            this.preloader.show(true);
        }

        return next
            .handle(req)
            .pipe(
                finalize(() => {
                    if (usePreloader) {
                        this.preloader.show(false);
                    }
                })
            );
    }
}
