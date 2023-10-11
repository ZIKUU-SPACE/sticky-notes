# sticky-notes

Sticky-NotesはMongoDBをストレージに使った簡単なノートアプリです。
UI部分は[自作のMicro UIフレームワーク](https://serve-mui.netlify.app)を使っています。このフレームワークはJavaScript UIコンポーネントの習作です。

## 動かす　.envファイルとdbディレクトリを作成する

.envの内容なこんな感じ。

```
SERVER_PORT=3000
MongoURI="mongodb://localhost:27017/stickynote"
SecretKey="secret123"
```

これらの環境変数はdocker-compose.ymlの中でオーバーライドできる。
プロジェクトのdocker-compose.ymlではMongoURIをオーバーライドしている。

dbディレクトリはMongoDBのデータをホストOS側に永続化するため。



## Docker compose

プロジェクトディレクトリで以下のコマンドを実行するとMongoDBとSticky-Notesのコンテナが起動してデプロイが完了する。

```
docker compose up -d
```

コンテナを停止するには次のコマンドを実行する。

```
docker compose down
```

コンテナが停止してもdbディレクトリにMongoDBのデータが残るので次回起動したときは前回停止した時点の状態を引き継げる。

イメージを作り直す場合は、dbディレクトリの中のファイルはすべて削除してから docker composeコマンドを実行する。
