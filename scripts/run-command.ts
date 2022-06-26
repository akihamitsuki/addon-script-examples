import * as mc from 'mojang-minecraft';

const dimension = mc.world.getDimension('overworld');

function toString(location: mc.BlockLocation) {
  return `${location.x} ${location.y} ${location.z}`;
}

/**
 * コマンド結果を受け取る
 */
function result(player: mc.Player) {
  try {
    // コマンドの結果をJSON構造のオブジェクトで受け取れる
    const result = player.runCommand('effect @s levitation 3 1 true');
    // 内容をすべて表示。中に何が入っているかはコマンドにより異なる
    player.runCommand(`say ${JSON.stringify(result)}`);
    // 内容を取り出して使うことができる
    player.runCommand(`say ${result.statusMessage}`);
  } catch {
    player.runCommand(`say [error] command error`);
  }
}

/**
 * 多すぎるコマンドの処理
 */
function tooManyCommands(player: mc.Player) {
  const commands: string[] = [];

  mc.world.events.tick.subscribe((event) => {
    if (commands.length) {
      for (let i = 0; i < 50; i += 1) {
        const command = commands.shift();
        if (command) {
          dimension.runCommand(command);
        }
      }
      dimension.runCommand(`say ${commands.length}`);
    }
  });

  const range = 10;
  for (let x = range; x >= -range; x -= 1) {
    for (let y = 0; y >= -range; y -= 1) {
      for (let z = range; z >= -range; z -= 1) {
        const location = player.location;
        const target = new mc.BlockLocation(location.x + x, location.y + y, location.z + z);
        // setblockの場合、同時(1tick)に処理できる数はおそらく128まで。それ以上は実行されない
        // それを超える場合は、コマンド文を保存しておき、ティックごとに定期的に処理すれば処理落ちはしない
        commands.push(`setblock ${toString(target)} air`);
      }
    }
  }
}
