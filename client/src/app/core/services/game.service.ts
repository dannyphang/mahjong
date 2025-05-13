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
    mahjongFullList: MahjongDto[] = [];

    constructor(
        private http: HttpClient
    ) {
    }

    set setMahjongList(mahjongList: MahjongDto[]) {
        this.mahjongFullList = mahjongList;
    }

    get getMahjongList(): MahjongDto[] {
        return this.mahjongFullList;
    }

    getAllMahjong(): Observable<ResponseModel<MahjongDto[]>> {
        return this.http.get<ResponseModel<MahjongDto[]>>(apiConfig.baseUrl + '/mahjong').pipe();
    }

    createRoom(): Observable<ResponseModel<RoomDto>> {
        return this.http.post<ResponseModel<RoomDto>>(apiConfig.baseUrl + '/room', null).pipe();
    }

    getRoomById(roomId: string): Observable<ResponseModel<any>> {
        return this.http.get<ResponseModel<any>>(apiConfig.baseUrl + '/room/' + roomId).pipe();
    }

    createPlayer(player: PlayerDto): Observable<ResponseModel<PlayerDto>> {
        return this.http.post<ResponseModel<PlayerDto>>(apiConfig.baseUrl + '/player', { player }).pipe();
    }

    updatePlayer(player: PlayerDto): Observable<ResponseModel<PlayerDto>> {
        return this.http.put<ResponseModel<PlayerDto>>(apiConfig.baseUrl + '/player', { player }).pipe();
    }

    getPlayerByName(name: string, pin: number): Observable<ResponseModel<PlayerDto[]>> {
        let header: HttpHeaders = new HttpHeaders({
            name: name,
            pin: pin
        });
        return this.http.get<ResponseModel<PlayerDto[]>>((apiConfig.baseUrl + '/player'), { headers: header }).pipe();
    }

    getCalculatePoint(player: PlayerDto): Observable<ResponseModel<MahjongCombinationGroupDto>> {
        return this.http.post<ResponseModel<MahjongCombinationGroupDto>>(apiConfig.baseUrl + '/mahjong/calculate_points', { player }).pipe();
    }

    checkMahjongIsTaken(room: RoomDto, uid: string): boolean {
        return room.mahjong.takenTiles?.find(m => m.uid === uid) ? true : false;
    }
}

export class RoomDto {
    roomId: string;
    roomCode: string;
    statusId: number;
    playerList: PlayerDto[];
    gameStarted: boolean;
    roomOwnerId?: string;
    mahjong: RoomMahjongGroupDto;
    gameOrder: number;
    waitingPlayer: PlayerDto;
    waitingAction: string;
    waitingTile: string;
    waiting: number; // 0 = no value, 1 = is waiting, 2 = cancelled
}

export class PlayerDto {
    userUid: string;
    playerId?: string;
    playerName: string;
    statusId: number;
    direction: number;
    mahjong: MahjongGroupDto;
    action: MahjongActionDto;
    drawAction: MahjongDrawActionDto;
    pin: number;
}

export class RoomUpdateDto extends RoomDto {
    response: {
        isSuccess: boolean;
        updateMessage: string;
    }
}

export class RoomErrorResponseDto {
    response: {
        isSuccess: boolean;
        updateMessage: string;
    }
}

export class MahjongGroupDto {
    handTiles: MahjongTileSetDto;
    publicTiles: [{ mahjongTile: MahjongDto[] }];
    flowerTiles: MahjongTileSetDto;
}

export class RoomMahjongGroupDto {
    discardTiles: MahjongDto[];
    remainingTiles: MahjongDto[];
    setting: MahjongSettingDto;
    takenTiles: MahjongDto[];
}

export class MahjongSettingDto {
    minPoints: number; // min points to win
    score: number; // 1 points = ? score
    initTotalScore: number; // each player initail total score
}

export class MahjongTileSetDto {
    point?: number;
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
    isSelected: boolean;
    isTaken: boolean;
}

export class MahjongActionDto {
    isPongable: boolean;
    isKongable: boolean;
    isChowable: boolean;
    isWinnable: boolean;
    isSelfKongable: boolean;
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
    isMenQianQing: boolean;

    isHuaShang: boolean;
    isKongShang: boolean;
}

export class MahjongCombinationGroupDto extends MahjongCombinationDto {
    points: number;
}

export class MahjongDrawActionDto {
    isDrawFlower: boolean;
    isDrawKong: boolean;
    isDrawSecondKong: boolean;
    isGetKong: boolean;
    isGetPong: boolean;
    isStealKong: boolean;
    isKaLong: boolean;
    isSoloPong: boolean;
    isDrawLastTile: boolean;
    isSoloDraw: boolean;
}