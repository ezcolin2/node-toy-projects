# ES Module에서 jest 사용하는 방법 


## npm 패키지 설치
`npm i -D jest @types/jest @babel/core @babel/preset-env`


## babel.config.json 작성
```
{
  "presets": ["@babel/preset-env"]
}

```

## jest.config.json 작성
```
{
  "verbose": true,
  "collectCoverage": true
}
```