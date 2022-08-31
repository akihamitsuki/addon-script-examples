import * as mc from 'mojang-minecraft';

/**
 * chat
 *
 * メッセージを送ったとき
 * 送信が完了した後に発生するイベント
 */
function onChat(event: mc.ChatEvent) {
  // 送信されたメッセージ
  const message: string = event.message;
  // メッセージが特定のプレイヤーにだけ送られたか(/msg, /t)
  const sendToTargets: boolean = event.sendToTargets;
  // 送信者
  const sender: mc.Entity = event.sender;
  // 送信対象(送信者は含まれない)
  const targets: mc.Player[] = event.targets;

  sender.runCommand('say *** メッセージ送信イベントが発生');
}

/**
 * beforeChat
 *
 * メッセージを送るとき
 * 送信する直前なので、メッセージの送信を停止することができる
 */
function onBeforeChat(event: mc.BeforeChatEvent) {
  // イベントを停止させるか
  event.cancel;
  // これから送信されるメッセージ
  event.message;
  // メッセージが特定のプレイヤーにだけ送られるか(/msg, /t)
  const sendToTargets: boolean = event.sendToTargets;
  // 送信者
  const sender: mc.Player = event.sender;
  // 送信対象(送信者は含まれない)
  const targets: mc.Player[] = event.targets;

  // メッセージが特定を含んでいれば
  if (event.message.includes('tnt')) {
    // TNTを呼び出す
    sender.runCommand(`summon tnt`);
    // メッセージを送信しない
    event.cancel = true;
  }

  // 特定のプレイヤーだけに送信されていれば（ひとりではテストできない）
  if (sendToTargets) {
    // メッセージが届くプレイヤーで繰り返し
    targets.forEach(function (target) {
      // メッセージ内容を変更する
      event.message = `${sender.nameTag} -> ${target.nameTag}: ${event.message}`;
    });
  }
}

export function toggleChatEvents(toggle: boolean) {
  if (toggle) {
    mc.world.events.chat.subscribe(onChat);
    mc.world.events.beforeChat.subscribe(onBeforeChat);
  } else {
    mc.world.events.chat.unsubscribe(onChat);
    mc.world.events.beforeChat.unsubscribe(onBeforeChat);
  }
}
