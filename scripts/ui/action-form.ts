import * as mc from 'mojang-minecraft';
import * as mcui from 'mojang-minecraft-ui';

export function showActionForm(event: mc.BeforeItemUseEvent): void {
  // 使用したアイテムが特定のアイテム以外なら処理を終了 -> 特定のアイテムを使用した場合だけ次の処理へ
  // ここでは羽根(feather)を使用した場合だけ有効
  if (event.item.id !== mc.MinecraftItemTypes.feather.id) {
    return;
  }

  // イベントからプレイヤーを取得する
  const player = <mc.Player>event.source;

  // フォームのインスタンスを作成
  const actionForm = new mcui.ActionFormData();
  // 題名を追加
  actionForm.title('アイテム選択');
  // 設問を追加
  actionForm.body('取得するアイテムを選んでください。');
  // 選択肢を追加（追加順が、そのまま並び順になる）
  actionForm.button('真珠色のカエルライト'); // 0
  actionForm.button('新緑色のカエルライト'); // 1
  actionForm.button('黄土色のカエルライト'); // 2

  // フォームを表示(show)し、入力後(then)の処理を続けて書く
  actionForm.show(player).then((response) => {
    // 選択した内容は0から順に数字で返ってくる
    const selection: number = response.selection;
    // 選択せずに、入力を取り消したかどうか（入力せずにフォームを閉じたら真）
    const isCanceled: boolean = response.isCanceled;

    // 入力を取り消した場合
    if (isCanceled) {
      player.dimension.runCommand(`say フォームを閉じました。`);
      return;
    }

    // 選択にあわせて処理を行う
    // 1番目の選択肢を選んだとき -> 0
    if (selection === 0) {
      player.dimension.runCommand(`give ${player.nameTag} pearlescent_froglight`);
    }
    // 2番目 -> 1
    else if (selection === 1) {
      player.dimension.runCommand(`give ${player.nameTag} verdant_froglight`);
    }
    // 3番目 -> 2
    else if (selection === 2) {
      player.dimension.runCommand(`give ${player.nameTag} ochre_froglight`);
    }
  });

  // アイテムの使用を取り消す
  event.cancel = true;
}

// mc.world.events.beforeItemUse.subscribe(showActionForm);
