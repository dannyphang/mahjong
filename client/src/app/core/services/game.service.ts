import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import apiConfig from '../../../environments/apiConfig';
import { ResponseModel } from './common.service';
import { NumberValueAccessor } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class GameService {

    constructor(
        private http: HttpClient
    ) {
    }

    getAllMahjong(): Observable<ResponseModel<MahjongDto[]>> {
        return this.http.get<ResponseModel<MahjongDto[]>>(apiConfig.baseUrl + '/mahjong').pipe();
    }

    createRoom(): Observable<ResponseModel<RoomDto>> {
        return this.http.post<ResponseModel<RoomDto>>(apiConfig.baseUrl + '/room', null).pipe();
    }

    getRoomById(roomId: string): Observable<ResponseModel<RoomDto>> {
        return this.http.get<ResponseModel<RoomDto>>(apiConfig.baseUrl + '/room/' + roomId).pipe();
    }

    createPlayer(player: PlayerDto): Observable<ResponseModel<PlayerDto>> {
        return this.http.post<ResponseModel<PlayerDto>>(apiConfig.baseUrl + '/player', { player }).pipe();
    }

    updatePlayer(player: PlayerDto): Observable<ResponseModel<PlayerDto>> {
        return this.http.put<ResponseModel<PlayerDto>>(apiConfig.baseUrl + '/player', { player }).pipe();
    }

    getPlayerByName(name: string): Observable<ResponseModel<PlayerDto[]>> {
        let header: HttpHeaders = new HttpHeaders({
            name: name
        });
        return this.http.get<ResponseModel<PlayerDto[]>>((apiConfig.baseUrl + '/player'), { headers: header }).pipe();
    }

    getCalculatePoint(player: PlayerDto): Observable<ResponseModel<MahjongCombinationGroupDto>> {
        return this.http.post<ResponseModel<MahjongCombinationGroupDto>>(apiConfig.baseUrl + '/mahjong/calculate_points', { player }).pipe();
    }
}

export class RoomDto {
    roomId: string;
    statusId: number;
    playerList: PlayerDto[];
    gameStarted: boolean;
    roomOwnerId?: string;
    mahjong: RoomMahjongGroupDto;
    gameOrder: number;
}

export class PlayerDto {
    playerId?: string;
    playerName: string;
    statusId: number;
    direction: number;
    mahjong: MahjongGroupDto;
    action: MahjongActionDto;
}

export class RoomUpdateDto extends RoomDto {
    response: {
        isSuccess: boolean;
        updateMessage: string;
    }
}

export class MahjongGroupDto {
    handTiles: MahjongTileSetDto;
    publicTiles: MahjongTileSetDto;
    flowerTiles: MahjongTileSetDto;
}

export class RoomMahjongGroupDto {
    discardTiles: MahjongDto[];
    remainingTiles: MahjongDto[];
}

export class MahjongTileSetDto {
    point: number;
    mahjongTile: MahjongDto[];
}

export class MahjongDto {
    uid: string;
    order: number;
    type: string;
    joker: boolean;
    name: string;
    code: string;
    direction: number;
    statusId: number;
    id: number;
    isSelected?: boolean;
    isTaken?: boolean;
}

export class MahjongActionDto {
    isPongable: boolean;
    isKongable: boolean;
    isChowable: boolean;
    isWinnable: boolean;
}

export class MahjongCombinationDto {
    isDuiDuiHu: boolean;
    isPingHu: boolean;
    isQuanTongZi: boolean;
    isYaoJiu: boolean;
    isQuanZi: boolean;
    isKanKanHu: boolean;
    isDaSanYuan: boolean;
    isXiaoSanYuan: boolean;
    isDaSiXi: boolean;
    isXiaoSiXi: boolean;
}

export class MahjongCombinationGroupDto extends MahjongCombinationDto {
    points: number;
}