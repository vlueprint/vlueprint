# rdflint をローカルでサクッと実行したい場合について

これを実行する

```bash
docker run --rm -v "$PWD":/usr/src/myapp -w /usr/src/myapp openjdk:11 \
bash -c \
"wget https://jitpack.io/com/github/imas/rdflint/0.1.5/rdflint-0.1.5.jar && \
java -jar rdflint-0.1.5.jar -config sparql-endpoint/rdflint-config.yml -targetdir sparql-endpoint/toLoad && \
rm rdflint-0.1.5.jar"
```
