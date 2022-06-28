import * as mc from 'mojang-minecraft';

/**
 * 検索条件無しの場合
 *
 * 取得できる範囲のすべてのエンティティを取得する
 */
function getEntities(player: mc.Player) {
  // 検索条件を設定しないと、すべてのエンティティを取得する
  // @e
  const entities: mc.EntityIterator = player.dimension.getEntities();
  // 返り値は配列ではなく、イテレーターと呼ばれる少し特殊な形式
  // https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Iterators_and_Generators
  // for ofで内容を取得するのが基本
  for (const entity of entities) {
    entity.runCommand(`say ${entity.id}`);
  }
  // 配列化するには次のようにスプレッド構文を使うと簡単に変換できる。
  // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Spread_syntax
  const entityArray: mc.Entity[] = [...entities];
}

/**
 * 検索条件を付け加える
 */
function query(player: mc.Player) {
  // 基本となるクエリ・インスタンスを作成する
  const query = new mc.EntityQueryOptions();
  // そのインスタンスに条件を付け加える
  // @e[type=player]
  query.type = mc.MinecraftEntityTypes.player.id;
  // 引数に作成した条件を付け加えてエンティティを取得
  const entities = player.dimension.getEntities(query);
  // 取得されたエンティティは指定の条件を満たしたものだけになる
  for (const entity of entities) {
    entity.runCommand(`say ${entity.nameTag}`);
  }
}

/**
 * 特定の条件を除く
 */
function exclude(player: mc.Player) {
  const query = new mc.EntityQueryOptions();
  // excludeはこの条件を満たすエンティティを除外する
  // @e[type=!player]
  query.excludeTypes = [mc.MinecraftEntityTypes.player.id]; // 配列であることに注意
  const entities = player.dimension.getEntities(query);
  for (const entity of entities) {
    entity.runCommand(`say ${entity.id}`);
  }
}

/**
 * 位置の条件
 */
function location(player: mc.Player) {
  const query = new mc.EntityQueryOptions();
  // 位置関係の条件を指定する場合は、基準となる座標を組み合わせる
  // 自分を中心に半径10ブロック以上30ブロック以内
  // @e[x=~, y=~, z=~, r=10, rm=30]
  query.location = player.location;
  query.maxDistance = 30;
  query.minDistance = 10;
  const entities = player.dimension.getEntities(query);
  for (const entity of entities) {
    entity.runCommand(`say ${entity.id}`);
  }
}

// 各種クエリ

// 名前がSteveのみ
// @e[name=Steve]
{
  const query = new mc.EntityQueryOptions();
  query.name = 'Steve';
}
// 名前がSteve,Alex以外
// @e[name=!Steve, name=!Alex]
{
  const query = new mc.EntityQueryOptions();
  query.excludeNames = ['Steve', 'Alex'];
}
// zobimeだけ
// @e[type=zombie]
{
  const query = new mc.EntityQueryOptions();
  query.type = 'zombie';
}

// zombieまたはcreeper以外
// @e[type=!zombie, type=!creeper]
{
  const query = new mc.EntityQueryOptions();
  query.excludeTypes = ['zombie', 'creeper'];
}
// モンスターのみ
// @e[family=zombie]
{
  const query = new mc.EntityQueryOptions();
  query.families = ['monster'];
}
// モンスター・動物以外のエンティティ
// @e[family=!monster, family=!animal]
{
  const query = new mc.EntityQueryOptions();
  query.excludeFamilies = ['monster', 'animal'];
}
// サバイバルモードのエンティティ
// @e[gamemode=survivval]
{
  const query = new mc.EntityQueryOptions();
  query.gameMode = mc.GameMode.survival;
}
// アドベンチャー・サバイバル以外のゲームモードのエンティティ
// @e[gamemode=!adventure, gamemode=!survival]
{
  const query = new mc.EntityQueryOptions();
  query.excludeGameModes = [mc.GameMode.adventure, mc.GameMode.survival];
}
// 'tagA'と'tagB'を両方持っているエンティティを取得する
// @e[tag=tagA, tag=tagB]
{
  const query = new mc.EntityQueryOptions();
  query.tags = ['tagA', 'tagB'];
}

// 'tagA'と'tagB'を両方持っていないエンティティを取得する
// @e[tag=!tagA, tag=!tagB]
{
  const query = new mc.EntityQueryOptions();
  query.excludeTags = ['tagA', 'tagB'];
}

// レベル10以下のエンティティを取得する
// @e[lm=10]
{
  const query = new mc.EntityQueryOptions();
  query.maxLevel = 10;
}
// レベル5以上のエンティティを取得する
// @e[l=5]
{
  const query = new mc.EntityQueryOptions();
  query.minLevel = 5;
}
// レベル5以上10以下
// @e[l=5, lm=10]
{
  const query = new mc.EntityQueryOptions();
  query.minLevel = 5;
  query.maxLevel = 10;
}
// レベル5のみ
// @e[l=5, lm=5]
{
  const query = new mc.EntityQueryOptions();
  query.minLevel = 5;
  query.maxLevel = 5;
}

// 向き

// -90度(東)から+90度(西)の間を向いているエンティティ
// @e[rx=90, rxm=-90]
{
  const query = new mc.EntityQueryOptions();
  query.minHorizontalRotation = 90;
  query.maxHorizontalRotation = -90;
}
// @e[ry=-45, rm=40]
{
  const query = new mc.EntityQueryOptions();
  query.minVerticalRotation = -45;
  query.maxVerticalRotation = 45;
}

// 位置

// 基準座標から最も遠いエンティティを3体
// @e[x=0, y=4, z=0, c=-3]
{
  const query = new mc.EntityQueryOptions();
  query.location = new mc.Location(0, 4, 0);
  query.farthest = 3;
}
// 基準座標から最も近いエンティティ1体
// @e[x=0, y=4, z=0, c=1]
{
  const query = new mc.EntityQueryOptions();
  query.location = new mc.Location(0, 4, 0);
  query.closest = 1;
}
// @e[x=0, y=4, z=0, dx=5, dy=6, dz=7]
{
  const query = new mc.EntityQueryOptions();
  query.location = new mc.Location(0, 4, 0);
  query.volume = new mc.BlockAreaSize(5, 6, 7);
}

// 基準座標から30ブロック以内のエンティティ
// @e[x=0, y=4, z=0, rm=30]
{
  const query = new mc.EntityQueryOptions();
  query.location = new mc.Location(0, 4, 0);
  query.maxDistance = 30;
}
// 基準座標から10ブロック以降のエンティティ
// @e[x=0, y=4, z=0, r=10]
{
  const query = new mc.EntityQueryOptions();
  query.location = new mc.Location(0, 4, 0);
  query.minDistance = 10;
}
