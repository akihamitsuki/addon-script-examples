import * as mc from 'mojang-minecraft';
import * as mcui from 'mojang-minecraft-ui';

export function showMessageForm(event: mc.BeforeItemUseEvent): void {
  // 使用したアイテムが特定のアイテム以外なら処理を終了 -> 特定のアイテムを使用した場合だけ次の処理へ
  // ここでは羽根(feather)を使用した場合だけ有効
  if (event.item.id !== mc.MinecraftItemTypes.feather.id) {
    return;
  }

  // イベントからプレイヤーを取得する
  const player = <mc.Player>event.source;

  // メッセージフォームのインスタンスを作成
  const messageForm = new mcui.MessageFormData();
  // 題名を追加
  messageForm.title('問題');
  // 表示する文章を追加
  // 改行は \n (バックスラッシュ + エヌ)
  messageForm.body('「ウィザー」と「ウォーデン」では、\n「ウィザー」の方がHPが高い？');
  // 選択肢1
  messageForm.button1('はい'); // yes -> true -> 1
  // 選択肢2
  messageForm.button2('いいえ'); // no -> false -> 0

  // フォームを表示(show)し、入力後(then)の処理を続けて書く
  messageForm.show(player).then((response) => {
    // 選択した内容は0から順に数字で返ってくる
    const selection: number = response.selection;
    // 選択せずに、入力を取り消したかどうか（入力せずにフォームを閉じたら真）
    const isCanceled: boolean = response.isCanceled;

    // 入力を取り消した場合
    if (isCanceled) {
      player.dimension.runCommand(`say フォームを閉じました。`);
      return;
    }

    // 選択にあわせて処理を行う(1番目が1で、2番目が0になるので注意)
    if (selection === 1) {
      player.dimension.runCommand(`say 正解です。`);
    } else {
      player.dimension.runCommand(`say 不正解です。`);
    }
  });

  // アイテムの使用を取り消す
  event.cancel = true;
}

// mc.world.events.beforeItemUse.subscribe(showMessageForm);
