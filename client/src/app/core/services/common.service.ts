import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class CommonService {
    language: string = 'en';

    constructor(
        private http: HttpClient
    ) {
    }

    setLanguage(lang: string) {
        this.language = lang;
    }

    getLanguage(): string {
        return this.language;
    }

    // getAllActivities(): Observable<ResponseModel<ActivityDto[]>> {
    //     return this.http.get<ResponseModel<ActivityDto[]>>(apiConfig.baseUrl + '/activity').pipe();
    // }

    // getAllActivitiesByProfileId(profile: {
    //     contactId?: string,
    //     companyId?: string
    // }): Observable<ResponseModel<ActivityDto>> {
    //     return this.http.post<ResponseModel<ActivityDto>>(apiConfig.baseUrl + '/activity/getActivitiesByProfileId', { profile }).pipe();
    // }
}

export class BasedDto {

}

export class ResponseModel<T> {
    data: T;
    isSuccess: boolean;
    responseMessage: string;
}