import * as mc from 'mojang-minecraft';
import * as mcui from 'mojang-minecraft-ui';

// 特定のアイテムを使用したときにフォームを表示する（他のイベントでもよい）
function onBeforeItemUse(event: mc.BeforeItemUseEvent) {
  // プレイヤー以外が起こしたイベントなら（起こせるかどうかわからないが）処理を終了
  if (event.source.id !== mc.MinecraftEntityTypes.player.id) {
    // ここで関数を終了
    return;
  }
  // 使用したアイテムが特定のアイテム以外なら処理を終了
  if (event.item.id !== mc.MinecraftItemTypes.feather.id) {
    return;
  }

  // 使用者の型をEntityからPlayerに変更（ここのsourseはEntity型）
  const player: mc.Player = <mc.Player>event.source;
  // ModalFormのインスタンスを作成
  const ModalForm = new mcui.ModalFormData();

  // 題名を設定
  ModalForm.title('フォームの題名');
  // アイコンも設定できるらしい（画像はリソースパックから）
  // ModalForm.icon('textures/blocks/bedrock');

  // ドロップダウン(number)
  const dropdownLabel = 'ドロップダウン';
  const dropdownOptions = ['選択肢1', '選択肢2', '選択肢3', '選択肢4'];
  const dropdownDefault = 0;
  ModalForm.dropdown(dropdownLabel, dropdownOptions, dropdownDefault);

  // スライダー(number)
  const sliderLabel = 'スライダー';
  // 下限: 負の数も指定できる
  const sliderMin = -100;
  // 上限: 兆単位でも扱えるはず
  const sliderMax = 100;
  // 間隔: 小数も指定できる（小数は扱いが難しいので、できるだけ使わないように）
  const sliderStep = 5.5;
  // 初期値を取得
  const sliderDefault = 0;
  ModalForm.slider(sliderLabel, sliderMin, sliderMax, sliderStep, sliderDefault);

  // 文字入力(string)
  const textTitle: string = 'テキスト入力';
  const textPlaceholder: string = 'ここに入力';
  const textDefault = '';
  ModalForm.textField(textTitle, textPlaceholder, textDefault);

  // 切り替え(boolean)
  const toggleLabel = '切り替えスイッチ';
  const toggleDefault = false;
  ModalForm.toggle(toggleLabel, toggleDefault);

  // モーダルを表示
  ModalForm.show(player).then((response) => {
    const isCanceled: boolean = response.isCanceled;
    // 上で追加した順に、入力した値が配列に入っている
    const [dropdown, slider, input, toggle] = response.formValues;

    if (isCanceled) {
      // 常にfalseのような気がする
      // 入力しなかった場合はそもそもこの部分が動いていないかも
      player.runCommand('say フォームを閉じました');
      // 処理を終了
      return;
    }

    player.runCommand(`say ${dropdown} ${slider} ${input} ${toggle}`);

    player.runCommand(`say 設定を更新しました。`);
  });
}

export function registerModalFormEvents() {
  mc.world.events.beforeItemUse.subscribe(onBeforeItemUse);
}
