import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import apiConfig from '../../../environments/apiConfig';
import { ResponseModel } from './common.service';

@Injectable({
    providedIn: 'root',
})
export class GameService {

    constructor(
        private http: HttpClient
    ) {
    }

    getAllCharacter(): Observable<ResponseModel<CharacterDto[]>> {
        return this.http.get<ResponseModel<CharacterDto[]>>(apiConfig.baseUrl + '/character').pipe();
    }

    createRoom(): Observable<ResponseModel<RoomDto>> {
        return this.http.post<ResponseModel<RoomDto>>(apiConfig.baseUrl + '/room', null).pipe();
    }

    getRoomById(roomId: string): Observable<ResponseModel<RoomDto>> {
        return this.http.get<ResponseModel<RoomDto>>(apiConfig.baseUrl + '/room/' + roomId).pipe();
    }

    createPlayer(player: CreatePlayerDto): Observable<ResponseModel<PlayerDto>> {
        return this.http.post<ResponseModel<PlayerDto>>(apiConfig.baseUrl + '/player', { player }).pipe();
    }

    getPlayerByName(name: string): Observable<ResponseModel<PlayerDto[]>> {
        let header: HttpHeaders = new HttpHeaders({
            name: name
        });
        return this.http.get<ResponseModel<PlayerDto[]>>((apiConfig.baseUrl + '/player'), { headers: header }).pipe();
    }
}

export class CharacterDto {
    characterId: string;
    characterOrder: number;
    characterDescription: string;
    characterName: string;
    characterSide: '神' | '狼' | '民';
    statusId: number;
}

export class RoomDto {
    roomId: string;
    statusId: number;
    playerList: PlayerDto[];
    gameStarted: boolean;
}

export class PlayerDto {
    playerId: string;
    playerName: string;
    statusId: number;
    characterId: string;
    isOut: boolean;
}

export class CreatePlayerDto {
    playerName: string;
    statusId: number;
    isOut: boolean;
}

export class RoomUpdateDto {
    roomId: string;
    playerList: PlayerDto[];
    gameStarted: boolean;
    updateMessage: string;
}