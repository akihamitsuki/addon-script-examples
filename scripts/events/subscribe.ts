import * as mc from 'mojang-minecraft';
import { onBlockBreak } from './block';

export function switchEvent() {
  // チャットイベントを無名のアロー関数で登録する
  mc.world.events.beforeChat.subscribe((event) => {
    // チャット内容で判定
    if (event.message === 'true') {
      // イベントを登録する
      event.sender.dimension.runCommand('say subscribe onBlockBreak()');
      mc.world.events.blockBreak.subscribe(onBlockBreak);
      event.cancel = true;
    }

    if (event.message === 'false') {
      // イベントを削除する
      event.sender.dimension.runCommand('say unsubscribe onBlockBreak()');
      mc.world.events.blockBreak.unsubscribe(onBlockBreak);
      event.cancel = true;
    }
  });
}
