import * as mc from 'mojang-minecraft';

/**
 * chat
 *
 * メッセージを送ったとき
 */
export function onChat(event: mc.ChatEvent) {
  // 送信されたメッセージ
  const message: string = event.message;
  // メッセージが特定のプレイヤーにだけ送られたか(/msg, /t)
  const sendToTargets: boolean = event.sendToTargets;
  // 送信者
  const sender: mc.Entity = event.sender;
  // 対象
  const targets: mc.Player[] = event.targets;
}

/**
 * beforeChat
 *
 * メッセージを送る前
 */
export function onBeforeChat(event: mc.BeforeChatEvent) {
  // イベントを停止させるか
  event.cancel;
  // これから送信されるメッセージ
  event.message;
  // メッセージが特定のプレイヤーにだけ送られるか(/msg, /t)
  const sendToTargets: boolean = event.sendToTargets;
  // 送信者
  const sender: mc.Entity = event.sender;
  // 対象
  const targets: mc.Player[] = event.targets;

  // メッセージが特定の内容なら
  if (event.message === 'creeper') {
    // メッセージが届くプレイヤーで繰り返し
    targets.forEach(function (target) {
      // 対象プレイヤーの座標を取得し
      const x = target.location.x;
      const y = target.location.y;
      const z = target.location.z;
      // その位置にクリーパーを呼び出す
      target.dimension.runCommand(`summon creeper ${x} ${y} ${z}`);
    });
    // メッセージを送信しない
    event.cancel = true;
  }

  // 特定のプレイヤーだけに送信されていれば
  if (sendToTargets) {
    // メッセージが届くプレイヤーで繰り返し
    targets.forEach(function (target) {
      // メッセージ内容を変更する
      event.message = `${sender.nameTag} -> ${target.nameTag}: ${event.message}`;
    });
  }
}

export function registerChatEvents() {
  mc.world.events.chat.subscribe(onChat);
  mc.world.events.beforeChat.subscribe(onBeforeChat);
}
