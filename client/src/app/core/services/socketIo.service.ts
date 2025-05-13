import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import apiConfig from '../../../environments/apiConfig';
import { GameService, MahjongDto, PlayerDto, RoomDto, RoomErrorResponseDto, RoomUpdateDto } from './game.service';

@Injectable({
    providedIn: 'root',
})
export class SocketioService {
    socket: Socket;
    currentPlayer: PlayerDto;
    currentRoom: RoomDto;

    constructor(
        private gameService: GameService
    ) { }

    set player(player: PlayerDto) {
        this.currentPlayer = player;
    }

    get player(): PlayerDto {
        return this.currentPlayer;
    }

    set room(room: RoomDto) {
        this.currentRoom = room;
    }

    get room(): RoomDto {
        return this.currentRoom;
    }

    connect() {
        this.socket = io(apiConfig.socketUrl);
    }

    playerJoinRoom(player: PlayerDto, room: RoomDto) {
        this.socket.emit('joinRoom', { room: room, player: player });
    }

    startGame(room: RoomDto) {
        this.socket.emit('startGame', { room: room });
    }

    startTestGame(room: RoomDto) {
        this.socket.emit('testGame', { room: room });
    }

    sendRoomUpdate(room: RoomDto) {
        this.socket.emit('roomUpdate', { room: room });
    }

    recieveJoinedPlayers() {
        return new Observable<RoomUpdateDto>((observer) => {
            this.socket.on('joinRoom', (room) => {
                observer.next(this.assignMahjongToRoom(room));
            });
        });
    }

    recieveRoomUpdate() {
        return new Observable<RoomUpdateDto>((observer) => {
            this.socket.on('roomUpdate', (room: any) => {
                observer.next(this.assignMahjongToRoom(room));
            });
        });
    }

    recievePlayerRemove() {
        return new Observable<RoomUpdateDto>((observer) => {
            this.socket.on('playerRemove', (room: any) => {
                observer.next(this.assignMahjongToRoom(room));
            });
        });
    }

    recieveRoomError() {
        return new Observable<RoomErrorResponseDto>((observer) => {
            this.socket.on('roomError', (room: RoomErrorResponseDto) => {
                observer.next(room);
            });
        });
    }

    assignMahjongToRoom(room: any): RoomUpdateDto {
        let playerList: PlayerDto[] = [];
        room.playerList.forEach((player: any) => {
            let updatedPlayer: PlayerDto = {
                ...player,
                mahjong: {
                    flowerTiles: {
                        mahjongTile: this.gameService.mahjongFullList.filter(m => player.mahjong.flowerTiles.mahjongTile.includes(m.uid)),
                    },
                    handTiles: {
                        mahjongTile: this.gameService.mahjongFullList.filter(m => player.mahjong.handTiles.mahjongTile.includes(m.uid))
                    },
                    publicTiles: player.mahjong.publicTiles.map((tileGroup: any) => ({
                        mahjongTile: this.gameService.mahjongFullList.filter(m =>
                            tileGroup.mahjongTile.some((tile: any) => tile === m.uid)
                        )
                    }))

                }
            }
            playerList.push(updatedPlayer)
        })

        let newUpdatedRoom: RoomUpdateDto = {
            ...room,
            mahjong: {
                ...room.mahjong,
                remainingTiles: this.gameService.mahjongFullList.filter(m => room.mahjong.remainingTiles.includes(m.uid)),
                discardTiles: this.gameService.mahjongFullList.filter(m => room.mahjong.discardTiles.includes(m.uid)),
                takenTiles: this.gameService.mahjongFullList.filter(m => room.mahjong.takenTiles.includes(m.uid)),
            },
            playerList: playerList
        }

        return newUpdatedRoom;
    }

    sendPlayerQuitRoom(room: RoomDto, player: PlayerDto) {
        this.socket.emit('quitRoom', { room: room, player: player });
    }

    disconnectSocket() {
        this.socket.disconnect();
    }

    sendDiscardMahjongTile(room: RoomDto, player: PlayerDto, discardedMahjongTile: MahjongDto) {
        this.socket.emit('discardMahjong', { room: room, player: player, discardedMahjongTile: discardedMahjongTile });
    }

    sendNextTurn(room: RoomDto) {
        this.socket.emit('nextTurn', { room: room });
    }

    sendDrawMahjong(room: RoomDto, player: PlayerDto) {
        this.socket.emit('drawMahjong', { room: room, player: player });
    }

    sendMahjongAction(action: string, room: RoomDto, player: PlayerDto, selectedMahjong: MahjongDto) {
        this.socket.emit('action', { action: action, room: room, player: player, selectedMahjong: selectedMahjong });
    }

    sendChow(room: RoomDto, player: PlayerDto, selectedMahjongChow: MahjongDto[], selectedMahjong: MahjongDto) {
        this.socket.emit('chow', { room: room, player: player, selectedMahjongChow: selectedMahjongChow, selectedMahjong: selectedMahjong });
    }

    sendGameEnd(room: RoomDto) {
        this.socket.emit('gameEnd', { room: room });
    }

    sendWin(room: RoomDto, player: PlayerDto, selectedMahjongSet: MahjongDto[]) {
        this.socket.emit('win', { room: room, player: player, selectedMahjongSet: selectedMahjongSet });
    }

    sendRemovePlayer(room: RoomDto, player: PlayerDto) {
        this.socket.emit('removePlayer', { room: room, player: player });
    }
}