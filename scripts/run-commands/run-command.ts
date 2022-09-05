import * as mc from 'mojang-minecraft';

/**
 * エンティティのメソッドからコマンドを実行した場合は、`@s`がそのエンティティになる
 */
export function runCommandByEntity(event: mc.BeforeChatEvent) {
  if (event.message === 'byentity') {
    try {
      // execute @e ~ ~ ~ summon lightning_bolt
      event.sender.runCommand('summon lightning_bolt');
      // 上のコマンドが成功したらこれが表示される
      event.sender.runCommand(`say success`);
    } catch (error) {
      // もし失敗したらこちらが表示される
      event.sender.runCommand(`say error: ${error}`);
    }

    event.cancel = true;
  }
}

/**
 * 次元のメソッドから実行した場合、`@s`は無効
 */
export function runCommandByDimension(event: mc.BeforeChatEvent) {
  if (event.message === 'bydimension') {
    try {
      event.sender.dimension.runCommand(`give @s apple`);
      // 上のコマンドが成功したらこれが表示されるはず
      event.sender.dimension.runCommand(`say success`);
    } catch (error) {
      // 実際はこちらが表示される
      event.sender.dimension.runCommand(`say error: ${error}`);
      // -> {"statuCode": -2147352576, "statusMessage": "セレクターに合う対象がありません"}
    }

    event.cancel = true;
  }
}

/**
 * コマンド結果を受け取る
 */
export function runCommandResult(event: mc.BeforeChatEvent) {
  if (event.message === 'commandresult') {
    try {
      // コマンドの結果をJSON構造のオブジェクトで受け取れる
      const result = event.sender.runCommand('effect @s levitation 3 1 true');
      // 内容をすべて表示。中に何が入っているかはコマンドにより異なる
      event.sender.runCommand(`say ${JSON.stringify(result)}`);
      // JSON構造なので、オブジェクトとして内容を取り出して使うことができる
      event.sender.runCommand(`say ${result.statusMessage}`);
      // -> {"amplifier": 1, "effect": "levitation", "player": ["Steve"], "seconds": 3, "statusCode": 0, "statusMessage" "Steveに浮遊*1を3秒間与えました"}
      event.sender.runCommand(`say 強さ:${result['amplifier']}, 秒数:${result['seconds']}`);
    } catch (error) {
      event.sender.runCommand(`say error ${error}`);
    }

    event.cancel = true;
  }
}

/**
 * 多すぎるコマンドの処理
 *
 * setblockの場合、同時(1tick)に処理できる数はおそらく128まで。それ以上は実行されない
 * それを超える場合は、コマンド文を保存しておき、ティックごとに定期的に処理すれば、少なくとも中断・処理落ちはしない
 *
 * 実際には同等機能のスクリプトを使った方が処理速度が速い
 */
export function tooManyCommands(player: mc.Player) {
  const dimension = mc.world.getDimension(mc.MinecraftDimensionTypes.overworld);
  // コマンドを保存する配列
  const commands: string[] = [];

  // ティックごとにコマンドを一定数だけ実行するコマンド
  mc.world.events.tick.subscribe((event) => {
    if (commands.length) {
      for (let i = 0; i < 10; i += 1) {
        // pop() ではなく shift() にすると入れた順に実行できるが処理が遅い
        const command = commands.pop();
        if (command) {
          dimension.runCommand(command);
        }
      }
      dimension.runCommand(`say 残りコマンド数: ${commands.length}`);
    }
  });

  // 11の3乗分のsetblockを実行する
  const range = 5;
  // プレイヤーの座標を基準にする
  const loc = player.location;
  for (let x = -range; x <= range; x += 1) {
    for (let y = -range; y <= range; y += 1) {
      for (let z = -range; z <= range; z += 1) {
        // 新しくBlockLocationを作成する
        const target = new mc.BlockLocation(loc.x + x, loc.y + y, loc.z + z);
        // この時点でコマンドを実行した場合は上限（？）にひっかかり、一定数で停止する
        // 一旦配列に入れて保存し、分けて実行する
        commands.push(`setblock ${target.x} ${target.y} ${target.z} air`);

        // 無理にコマンドを重ねずに、次のように同等機能のスクリプトを使うことを推奨
        // dimension.getBlock(target).setType(mc.MinecraftBlockTypes.air);
      }
    }
  }
}

export function toggleRunCommandTests(toggle: boolean) {
  if (toggle) {
    mc.world.events.beforeChat.subscribe(runCommandByEntity);
    mc.world.events.beforeChat.subscribe(runCommandByDimension);
    mc.world.events.beforeChat.subscribe(runCommandResult);
  } else {
    mc.world.events.beforeChat.unsubscribe(runCommandByEntity);
    mc.world.events.beforeChat.unsubscribe(runCommandByDimension);
    mc.world.events.beforeChat.unsubscribe(runCommandResult);
  }
}
