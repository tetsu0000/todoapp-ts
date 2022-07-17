# デプロイ手順

以下のコマンドを実行

```bash
npm install
cdk deploy TodoappTsStack
```

# 動作確認方法

以下のコマンドを実行

```bash
export ENDPOINT="API Gatewayのエンドポイント"
bash test/test.sh
```

# アプリ削除方法

以下のコマンドを実行

```bash
cdk destroy TodoappTsStack
```
