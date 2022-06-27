import * as mc from 'mojang-minecraft';

/**
 * エンティティのメソッドからコマンドを実行した場合は、`@s`がそのエンティティになる
 */
export function runCommandByEntity() {
  const dimension = mc.world.getDimension(mc.MinecraftDimensionTypes.overworld);
  const entities = dimension.getEntities();
  for (const entity of entities) {
    try {
      // execute @e ~ ~ ~ summon lightning_bolt
      entity.runCommand('summon lightning_bolt');
      entity.runCommand(`say success`);
    } catch {
      entity.runCommand(`say error`);
    }
  }
}

/**
 * 次元のメソッドから実行した場合、`@s`は無効
 */
export function runCommandByDimension() {
  const dimension = mc.world.getDimension(mc.MinecraftDimensionTypes.overworld);
  try {
    dimension.runCommand(`give @s apple`);
    dimension.runCommand(`say success`);
  } catch {
    dimension.runCommand(`say error`);
  }
}

/**
 * コマンド結果を受け取る
 */
export function result(player: mc.Player) {
  try {
    // コマンドの結果をJSON構造のオブジェクトで受け取れる
    const result = player.runCommand('effect @s levitation 3 1 true');
    // 内容をすべて表示。中に何が入っているかはコマンドにより異なる
    player.runCommand(`say ${JSON.stringify(result)}`);
    // JSON構造なので、オブジェクトとして内容を取り出して使うことができる
    player.runCommand(`say ${result.statusMessage}`);
  } catch {
    player.runCommand(`say error`);
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
