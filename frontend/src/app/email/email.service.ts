import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Email } from './models/email';

@Injectable({
    providedIn: 'root'
})
export class EmailService {

    constructor(public http: HttpClient) { }

    getList(params: any = {}): Observable<Email[]> {
        return this.http.get<Email[]>(`/api/emails`, { params });
    }

    getEmailSource(id: string): Observable<any> {
        return this.http.get(`/api/emails/${id}/source`, { responseType: 'text' });
    }

    downloadEmail(id: string): Observable<any> {
        return this.http
            .get(
                `/api/emails/${id}/source/download`,
                {
                    responseType: 'blob',
                    observe: 'response'
                }
            )
            .pipe(tap(response => {
                let fileName = 'email.eml';
                try {
                    fileName = response.headers.get('Content-Disposition').split(';')[1].split('=')[1];
                } catch (e) {}
                if (navigator.appVersion.toString().indexOf('.NET') > 0)
                    window.navigator.msSaveBlob(response.body, fileName);
                else {
                    const blob = new Blob([response.body], { type: 'application/octet-stream' });
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }));
    }

    delete(id: string): Observable<any> {
        return this.http.delete(`/api/emails/${id}`);
    }

    deleteMultiple(ids: string[]): Observable<any> {
        return this.http.post(`/api/emails/delete-multiple`, ids);
    }
}
