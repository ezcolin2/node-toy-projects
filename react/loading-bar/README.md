# 로딩 바 전역 적용

로딩 바를 한 번 만들어서 전역적으로 사용하는 법

### react-spinners
여러가지 종류의 로딩 바가 존재한다.
https://www.davidhu.io/react-spinners/storybook/?path=/docs/barloader--main

```
npm i react-spinners
```

정중앙에 오도록 css를 만들고 z-index 값을 줘서 가장 위로 올라오게 한다.

z-index 값을 주의해서 사용하자.

css는 width, height를 화면 가득차게 만들지 말자.

가득차면 아래 요소들이 눌리지 않는다.

```
  z-index: 100;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
```

### Provider

Provider를 만들어서 isLoading 값을 바꿀 수 있는 함수를 넘겨준다.

Provider를 전체적으로 감싸주고 자식 요소들이 isLoading 값을 바꿀 수 있도록 하자.