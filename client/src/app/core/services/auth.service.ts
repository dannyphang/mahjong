import { Injectable } from "@angular/core";
import apiConfig from "../../../environments/apiConfig";
import { HttpClient } from "@angular/common/http";
import { ToastService } from "./toast.service";
import { BasedDto, ResponseModel } from "./common.service";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthService {
    JWT_BASE_URL = apiConfig.authClient;
    private AUTH_URL = apiConfig.authUrl;
    private userSubject = new BehaviorSubject<UserDto>({} as UserDto);
    public user$ = this.userSubject.asObservable();

    setUser(user: UserDto) {
        this.userSubject.next(user);
    }

    get userC(): UserDto {
        return this.userSubject.value;
    }

    private paramData: ParamsDto = {
        token: undefined,
        project: undefined,
        redirect_uri: undefined,
        platform: [],
        signup: true,
        forgotPassword: true,
        rememberMe: true,
        email: undefined,
        displayName: undefined,
        username: undefined,
        profileImage: undefined,
        authUid: undefined,
    };

    constructor(
        private http: HttpClient,
        private toastService: ToastService
    ) { }

    set params(params: ParamsDto) {
        this.paramData = params;
    }

    get params() {
        return this.paramData;
    }

    returnParamDataUrl(): string {
        const params: Record<string, string | undefined | null> = {
            redirect_uri: this.paramData.redirect_uri ?? "http://localhost:4200/callback",
            project: this.paramData.project ?? "jwt",
            token: this.paramData.token,
            email: this.paramData.email,
            displayName: this.paramData.displayName,
            username: this.paramData.username,
            profileImage: this.paramData.profileImage,
        };

        const query = Object.entries(params)
            .filter(([_, value]) => value !== undefined && value !== null)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`)
            .join("&");

        return query ? `?${query}` : "";
    }

    callJWT() {
        let redirectUri = apiConfig.clientUrl + "/callback";
        window.location.href = `${this.JWT_BASE_URL}?redirect_uri=${redirectUri}&project=Mahjong`;
    }

    signOutUserAuth() {
        return this.http.post<ResponseModel<UserDto>>(this.AUTH_URL + "/auth/logout", {}, { withCredentials: true }).pipe();
    }

    getUserByAuthUid(uid: string): Observable<ResponseModel<UserDto>> {
        return this.http.get<ResponseModel<UserDto>>(apiConfig.baseUrl + '/auth/authUser/' + uid).pipe();
    }

    createMahjongUser(user: UserDto): Observable<ResponseModel<UserDto>> {
        return this.http.post<ResponseModel<UserDto>>(
            apiConfig.baseUrl + '/auth/createUser',
            { user: user }
        ).pipe();
    }

    getCurrentAuthUser(): Promise<UserDto> {
        return new Promise(async (resolve, reject) => {
            this.http.get<any>(`${this.AUTH_URL}/auth/user`, { withCredentials: true }).subscribe({
                next: res => {
                    let authUid = res.data.uid;

                    this.getUserByAuthUid(authUid).subscribe({
                        next: res2 => {
                            this.setUser(res2.data);
                            resolve(res2.data);
                        },
                        error: err => {
                            if (authUid) {
                                let newUser: UserDto = {
                                    authUid: authUid,
                                    email: res.data.email,
                                    username: res.data.username,
                                    displayName: res.data.displayName,
                                    profilePhotoUrl: res.data.profileImage,
                                    setting: {},
                                    lastActiveDateTime: new Date(),
                                }
                                this.createMahjongUser(newUser).subscribe(nUser => {
                                    this.setUser(nUser.data);
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

    setCurrentAuthUser(token: string): Observable<ResponseModel<any>> {
        return this.http.post<ResponseModel<any>>(
            this.AUTH_URL + "/auth/loginWithToken",
            { token: token },
            { withCredentials: true }
        ).pipe();
    }

    getJWTUserByAuthUid(uid: string): Observable<ResponseModel<UserDto>> {
        return this.http.get<ResponseModel<UserDto>>(this.AUTH_URL + '/auth/user/' + uid).pipe();
    }

    updateUserFirestore(user: UserDto): Observable<ResponseModel<any>> {
        user.uid = this.userC.uid;
        return this.http.put<any>(apiConfig.baseUrl + '/auth/user', { user }).pipe();
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
    username?: string;
    setting: SettingDto;
    lastActiveDateTime: Date;
}

export class SettingDto {
    darkMode?: boolean;
}

export class ParamsDto {
    redirect_uri?: string;
    project?: string;
    token?: string;
    platform: string[];
    signup?: boolean;
    forgotPassword?: boolean;
    rememberMe?: boolean;
    email?: string;
    displayName?: string;
    username?: string;
    profileImage?: string;
    authUid?: string;
    // [key: string]: any;
}