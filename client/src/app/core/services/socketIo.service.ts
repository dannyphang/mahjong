import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import apiConfig from '../../../environments/apiConfig';
import { PlayerDto, RoomDto, RoomUpdateDto } from './game.service';

@Injectable({
    providedIn: 'root',
})
export class SocketioService {
    socket: Socket;
    currentPlayer: PlayerDto;
    currentRoom: RoomDto;

    constructor() { }

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

    connect(gameId: string) {
        this.socket = io(apiConfig.socketUrl);
        // this.socket.emit('joinRoom', { gameId: gameId });
    }

    playerJoinRoom(player: PlayerDto, room: RoomDto) {
        this.socket.emit('joinRoom', { room: room, player: player });
    }

    startGame(room: RoomDto) {
        this.socket.emit('startGame', { room: room });
    }

    sendRoomUpdate(room: RoomDto) {
        this.socket.emit('roomUpdate', { room: room });
    }

    recieveJoinedPlayers() {
        return new Observable<RoomUpdateDto>((observer) => {
            this.socket.on('joinRoom', (room) => {
                observer.next(room);
            });
        });
    }

    recieveStartGame() {
        return new Observable<RoomUpdateDto>((observer) => {
            this.socket.on('startGame', (room: RoomUpdateDto) => {
                observer.next(room);
            });
        });
    }

    recieveRoomUpdate(roomId: string) {
        return new Observable<RoomUpdateDto>((observer) => {
            this.socket.on('roomUpdate', (room: RoomUpdateDto) => {
                observer.next(room);
            });
        });
    }

    sendPlayerQuitRoom(room: RoomDto, player: PlayerDto) {
        this.socket.emit('quitRoom', { room: room, player: player });
    }

    disconnectSocket() {
        this.socket.disconnect();
    }
}