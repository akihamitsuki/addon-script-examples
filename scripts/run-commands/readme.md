# コマンドの実行

GameTestFrameworkのスクリプト上でも、従来のスラッシュコマンドは使用できる。  
ただし、処理速度は専用のスクリプトで書いたほうが早い。


## 実行メソッドは2つのクラスにある

コマンドの実行メソッド`runCommand()`は、`Entity`クラスと`Dimension`クラスの2つにある。


### Entityクラスのメソッドから使用

`Entity`クラスのメソッドから実行した場合、そのエンティティが実行者になる。  
つまり、`@s`がメソッドを使用したエンティティになる。

```typescript
// このメソッドを実行したプレイヤーにリンゴを与える
player.runCommand('give @s apple');
```

### Dimensionクラスのメソッドから使用

`Dimension`クラスのメソッドから使用した場合は、サーバーから実行した場合と同等。  
この場合は使用者がエンティティではないため、`@s`は無効になる。

```typescript
// 実行者はエンティティでないので、@sを使うとエラー
dimension.runCommand('give @s apple');
```

## 実行結果を戻り値として取得できる

実行結果はJSON構造のオブジェクトとして取得可能。

```typescript
const result = player.runCommand('effect @s levitation 3 1 true');
```
