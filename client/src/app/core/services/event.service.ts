import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { forkJoin, from, Observable, switchMap } from 'rxjs';
import apiConfig from '../../../environments/apiConfig';

@Injectable({
    providedIn: 'root',
})
export class EventService {
    constructor(
        private http: HttpClient
    ) {

    }

    createEventLog(module: string, eventName: string, description?: string) {
        const url = `${apiConfig.eventUrl}/event`;

        return forkJoin([this.getAppPlatform(), this.getLocation()])
            .pipe(
                switchMap(([platform, location]) => {
                    const eventDetail = {
                        project: "Mahjong",
                        eventName,
                        description,
                        module,
                        appPlatform: platform.appPlatform,
                        browser: platform.browser,
                        browserVersion: platform.browserVersion,
                        mobileModel: platform.mobileModel,
                        mobileOSVersion: platform.mobile_OS_Version,
                        clientIMEI: '',
                        clientHostName: '',
                        clientIP: '',
                        clientPort: '',
                        clientLatitude: location.latitude ? '' + location.latitude : '',
                        clientLongitude: location.longitude ? '' + location.longitude : '',
                    };

                    return this.http.post(url, { eventDetail: eventDetail });
                }),
            )
            .subscribe();
    }

    private getAppPlatform() {
        return new Observable<{
            appPlatform: string;
            browser: string;
            browserVersion: string;
            mobileModel: string;
            mobile_OS_Version: string;
        }>((sub) => {
            if ((navigator as any).userAgentData) {
                from(
                    (navigator as any)['userAgentData'].getHighEntropyValues([
                        'architecture',
                        'model',
                        'platformVersion',
                        'fullVersionList',
                    ]),
                ).subscribe((val: any) => {
                    sub.next({
                        appPlatform: this.platFormWithVersion(
                            val.platform,
                            val.platformVersion,
                        ),
                        browser: val.brands[0].brand,
                        browserVersion: val.brands[0].version,
                        mobileModel: val.model,
                        mobile_OS_Version: val.platformVersion,
                    });
                    sub.complete();
                });
            } else {
                sub.next({
                    appPlatform: '',
                    browser: '',
                    browserVersion: '',
                    mobileModel: '',
                    mobile_OS_Version: '',
                });
                sub.complete();
            }
        });
    }

    private platFormWithVersion(platform: string, version: string) {
        if (platform === 'Windows') {
            return (
                'Windows ' +
                `${+version.split('.')[0] >= 10
                    ? +version.split('.')[0] >= 13
                        ? 11
                        : 10
                    : version
                }`
            );
        }
        return platform + ' ' + version;
    }

    private getLocation() {
        return new Observable<{
            latitude: number | null;
            longitude: number | null;
        }>((sub) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (e) => {
                        sub.next({
                            latitude: e.coords.latitude,
                            longitude: e.coords.longitude,
                        });
                        sub.complete();
                    },
                    (e) => {
                        sub.next({
                            latitude: null,
                            longitude: null,
                        });
                        sub.complete();
                    },
                );
            } else {
                sub.next({ latitude: null, longitude: null });
                sub.complete();
            }
        });
    }
}