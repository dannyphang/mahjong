import { Injectable } from "@angular/core";
import apiConfig from "../../../environments/apiConfig";
import { HttpClient } from "@angular/common/http";
import { ToastService } from "./toast.service";
import { BasedDto, ResponseModel } from "./common.service";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthService {
    JWT_BASE_URL = apiConfig.authClient;
    private AUTH_URL = apiConfig.authUrl;
    userC: UserDto;

    constructor(
        private http: HttpClient,
        private toastService: ToastService
    ) { }

    callJWT() {
        let redirectUri = apiConfig.clientUrl + "/callback";
        window.location.href = `${this.JWT_BASE_URL}?redirect_uri=${redirectUri}&project=Mahjong`;
    }

    signOutUserAuth() {
        return this.http.post<ResponseModel<UserDto>>(this.JWT_BASE_URL + "/auth/logout", {}).pipe();
    }

    getUserByAuthUid(uid: string): Observable<ResponseModel<UserDto>> {
        return this.http.get<ResponseModel<UserDto>>(apiConfig.baseUrl + '/auth/authUser/' + uid).pipe();
    }

    createMahjongUser(user: UserDto): Observable<ResponseModel<UserDto>> {
        return this.http.post<ResponseModel<UserDto>>(apiConfig.baseUrl + '/auth/createUser', { user: user }).pipe();
    }

    getCurrentAuthUser(): Promise<UserDto> {
        return new Promise(async (resolve, reject) => {
            this.http.get<any>(`${this.AUTH_URL}/auth/user`, { withCredentials: true }).subscribe({
                next: res => {
                    let authUid = res.data.uid;
                    this.getUserByAuthUid(authUid).subscribe({
                        next: res2 => {
                            this.userC = res2.data;
                            resolve(res2.data);
                        },
                        error: err => {
                            if (authUid) {
                                let newUser: UserDto = {
                                    authUid: authUid,
                                    email: res.data.email,
                                    setting: {},
                                    lastActiveDateTime: new Date(),
                                }
                                this.createMahjongUser(newUser).subscribe(nUser => {
                                    this.userC = nUser.data;
                                    resolve(nUser.data);
                                })
                            }
                            else {
                                reject(err);
                            }
                        }
                    });
                },
                error: err => {
                    reject(err)
                }
            })
        })
    }

    updateUserFirestore(user: UserDto[]): Observable<ResponseModel<any>> {
        // TODO
        return this.http.put<any>(apiConfig.baseUrl + '/auth/user/update', { user }).pipe();
    }
}

export class UserDto extends BasedDto {
    uid?: string;
    authUid?: string;
    firstName?: string;
    lastName?: string;
    nickname?: string;
    displayName?: string;
    phoneNumber?: string;
    profilePhotoUrl?: string;
    email: string;
    setting: SettingDto;
    lastActiveDateTime: Date;
}

export class SettingDto {
    darkMode?: boolean;
}