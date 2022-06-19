import * as mc from 'mojang-minecraft';
import * as mcui from 'mojang-minecraft-ui';

// ワールド作成時に、プレイヤーエンティティに設定保存用の場所（ダイナミックプロパティ）を作成する
function onWorldInitialize(event: mc.WorldInitializeEvent) {
  // 定義インスタンスを作成
  const playerDef = new mc.DynamicPropertiesDefinition();
  // 引数はダイナミックプロパティの任意の名前（変数名と同じ）
  // 他のアドオンと衝突しないように注意する（実際に使うときは例文の値をそのまま使わず、自分用に編集すること）
  // 数字型(number)を定義(define)
  playerDef.defineNumber('namespace:dropdown');
  playerDef.defineNumber('namespace:slider');
  // 文字列型(string)。第2引数は文字数の上限。上限を超えるとエラー扱い
  playerDef.defineString('namespace:text', 16);
  // 真偽値型(boolean)
  playerDef.defineBoolean('namespace:toggle');
  // プレイヤー（個人ではなくエンティティの種類）に対して、ダイナミックプロパティを設定
  event.propertyRegistry.registerEntityTypeDynamicProperties(playerDef, mc.MinecraftEntityTypes.player);
}

// プレイヤー参加時に初期値を設定する
function onPlayerJoin(event: mc.PlayerJoinEvent) {
  event.player.setDynamicProperty('namespace:dropdown', 0);
  event.player.setDynamicProperty('namespace:slider', 0);
  event.player.setDynamicProperty('namespace:text', '初期値');
  event.player.setDynamicProperty('namespace:toggle', false);
}

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
  let dropdownValue = 0;
  // try-catch構文
  // ダイナミックプロパティが取得できなかった場合には処理を停止させずに続ける
  try {
    // <number>は型変換(キャスト)
    dropdownValue = <number>player.getDynamicProperty('namespace:dropdown');
  } catch {
    // 上の try{} でエラーが起きたら、そこで停止せずに、ここの catch {} が動作する
    player.runCommand(`say [error] get dropdown`);
  }
  ModalForm.dropdown(dropdownLabel, dropdownOptions, dropdownValue);

  // スライダー(number)
  const sliderLabel = 'スライダー';
  // 下限: 負の数も指定できる
  const sliderMin = -100;
  // 上限: 兆単位でも扱えるはず
  const sliderMax = 100;
  // 間隔: 小数も指定できる（小数は扱いが難しいので、できるだけ使わないように）
  const sliderStep = 5.5;
  // 初期値を取得
  let sliderValue = 0;
  try {
    sliderValue = <number>player.getDynamicProperty('namespace:slider');
  } catch {
    player.runCommand(`say [error] get slider`);
  }
  ModalForm.slider(sliderLabel, sliderMin, sliderMax, sliderStep, sliderValue);

  // 文字入力(string)
  const textTitle: string = 'テキスト入力';
  const textPlaceholder: string = 'ここに入力';
  let textValue = '';
  try {
    textValue = <string>player.getDynamicProperty('namespace:text');
  } catch {
    player.runCommand(`say [error] get text`);
  }
  ModalForm.textField(textTitle, textPlaceholder, textValue);

  // 切り替え(boolean)
  const toggleLabel = '切り替えスイッチ';
  let toggleValue = false;
  try {
    toggleValue = <boolean>player.getDynamicProperty('namespace:toggle');
  } catch {
    player.runCommand(`say [error] get toggle`);
  }
  ModalForm.toggle(toggleLabel, toggleValue);

  // モーダルを表示
  ModalForm.show(player).then((response) => {
    const isCanceled: boolean = response.isCanceled;
    // 上で追加した順に、入力した値が配列に入っている
    const [dropdown, slider, input, toggle] = response.formValues;
    // const dropcown = response.farmValues[0]
    // const slider = response.farmValues[1]
    // ... と同じ処理

    if (isCanceled) {
      // 常にfalseのような気がする
      // 入力しなかった場合はそもそもこの部分が動いていないかも
      player.runCommand('say フォームを閉じました');
      // 処理を終了
      return;
    }

    // 送信した値をダイナミックプロパティに保存する
    try {
      player.setDynamicProperty('namespace:dropdown', dropdown);
    } catch {
      player.runCommand(`say [error] set dropdown `);
    }
    try {
      player.setDynamicProperty('namespace:slider', slider);
    } catch {
      player.runCommand(`say [error] set slider `);
    }
    try {
      player.setDynamicProperty('namespace:text', input);
    } catch {
      player.runCommand(`say [error] set text`);
    }
    try {
      player.setDynamicProperty('namespace:toggle', toggle);
    } catch {
      player.runCommand(`say [error] set toggle`);
    }

    player.runCommand(`say 設定を更新しました。`);
  });
}

export function registerDynamicPropertyEvents() {
  mc.world.events.worldInitialize.subscribe(onWorldInitialize);
  mc.world.events.playerJoin.subscribe(onPlayerJoin);
  mc.world.events.beforeItemUse.subscribe(onBeforeItemUse);
}
