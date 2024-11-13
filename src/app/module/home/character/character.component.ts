import { Component } from '@angular/core';
import { CharacterDto, GameService } from '../../../core/services/game.service';
import { BaseCoreAbstract } from '../../../core/shared/base/base-core.abstract';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrl: './character.component.scss'
})
export class CharacterComponent extends BaseCoreAbstract {

  characterList: CharacterDto[] = [];

  constructor(
    private gameService: GameService,
    protected override messageService: MessageService
  ) {
    super(messageService);
  }

  ngOnInit() {
    this.gameService.getAllCharacter().subscribe(res => {
      if (res.isSuccess) {
        console.log(res.data);
      }
    })
  }
}
