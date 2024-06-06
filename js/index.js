// 변수명 표기시 카멜표기법 사용
// 띄어쓰기 대신 대문자로 붙여서 표현

const 정답 = "APPLE";

// let -> 변경가능한 변수
// 몆글자 입력했는지
let index = 0;
// 몇번째 시도를 했는지
let attempts = 0;
// 타이머 변수 선언
let timer;

function appStart() {
  const displayGameover = () => {
    const div = document.createElement("div");
    div.innerText = "게임이 종료됐습니다.";
    div.style =
      "display: flex; justify-content: center; align-items: center; position: absolute; top: 40vh; left: 38vw; background: #FFFF00; width: 200px;height: 100px;";
    document.body.appendChild(div);
  };

  /*-----------------------------------------
   *	스스로 코딩
   * (틀렸을때 흔들기, 맞았을때 커지기-게임종료 느리게 뜨기)
   *	신입연수원 day4 팀장님 지시 업무 ②
   */
  const displayIncorrect = () => {
    const preRow = document.querySelector(`.row-${attempts - 1}`);

    preRow.animate(
      // keyframes
      [
        { transform: "translateX(0px)" },
        { transform: "translateX(-3px)" },
        { transform: "translateX(3px)" },
      ],
      {
        duration: 200,
        easing: "linear",
        direction: "alternate",
      }
    );
  };

  const displayCorrect = () => {
    const currentRow = document.querySelector(`.row-${attempts}`);
    // console.log(currentRow);

    currentRow.animate(
      // keyframes
      [
        { transform: "scale(1.0)" },
        { transform: "scale(1.1)" },
        { transform: "scale(1.0)" },
        { transform: "scale(1.1)" },
        { transform: "scale(1.0)" },
      ],
      {
        duration: 800,
        easing: "ease-in-out",
        direction: "alternate",
      }
    );
  };
  /*---------------------------------------*/

  const nextLine = () => {
    // 6번째 시도면 다음줄로 안넘어가고 게임끝내기
    // 강의에서 (attempts === 6) 이라고 나오는데
    // 6이면 7번째 시도라서 6줄 입력 + 엔터해도
    // 알파벳 입력하면 콘솔창에 오류뜸
    if (attempts === 5) return gameover();
    // 횟수 +1
    attempts += 1;
    // 글자수 다시 리셋 0
    index = 0;
    displayIncorrect();
  };

  const gameover = () => {
    // 게임을 시작하기 위해서 keydown 이벤트를 등록했으니
    // 게임이 종료되면 keydown 이벤트를 지우면됨
    window.removeEventListener("keydown", handleKeydown);
    // click 이벤트도 삭제
    window.removeEventListener("click", handleKeyClick);
    // setTimeout으로 게임종료 1초 후 뜨게함
    setTimeout(displayGameover, 1000);
    // timer 변수의 setInterval id를 리셋시켜줌
    // 게임 종료시 타이머 중지
    clearInterval(timer);
  };

  // 엔터키 눌렀을때 정답을 확인
  const handleEnterKey = () => {
    let 맞은_갯수 = 0;

    // 정답확인 로직
    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-column[data-index='${attempts}${i}']`
      );
      // 각 블록에 입력된 알파벳
      const 입력한_글자 = block.innerText;
      // APPLE 알파벳 하나씩
      const 정답_글자 = 정답[i];

      // 알파벳 O, 위치 O -> 초록색, 맞은_갯수+1
      if (입력한_글자 === 정답_글자) {
        맞은_갯수 += 1;
        block.style.background = "#6aaa64";
      }
      // 알파벳 O, 위치 X -> 노란색
      else if (정답.includes(입력한_글자)) block.style.background = "#C9B458";
      // 알파벳 X, 위치 X -> 회색
      else block.style.background = "#787c7e";

      // 글씨는 무조건 흰색 (조건없음)
      block.style.color = "white";

      /*-----------------------------------------
       *	스스로 코딩 (키보드에 정답표시)
       *	신입연수원 day4 팀장님 지시 업무 ①
       */
      // 입력한 글자를 data-key 값으로 가지는 keyboard-column 찾기
      const keyboard = document.querySelector(
        `.keyboard-column[data-key='${입력한_글자}']`
      );
      // 입력한 글자의 배경색 가져오기
      const 입력한_글자_배경색 = block.style.background;
      // 입력한 글자 = data-key 키보드 배경색 바꾸기
      keyboard.style.background = 입력한_글자_배경색;
      // data-key 키보드 글씨 무조건 흰색
      keyboard.style.color = "white";
      /*---------------------------------------*/
    }

    // 정답을 맞췄다면 게임끝!
    if (맞은_갯수 === 5) {
      gameover();
      displayCorrect();
    }
    // 정답이 아니면 다음줄로 넘어가는 함수 실행
    else nextLine();
  };

  // 백스페이스 눌렀을때
  const handleBackspace = () => {
    // 인덱스가 0일때 -1이면 안되니까
    if (index > 0) {
      // 이전 블록에 적힌 알파벳 없애기
      // 알파벳 입력하면 index값+1 되니까 현재 블록은 빈칸임
      const preBlock = document.querySelector(
        `.board-column[data-index='${attempts}${index - 1}']`
      );
      preBlock.innerText = "";
    }

    // 아무것도 입력되지 않은 경우를 제외하고 인덱스값 1씩 빼기
    if (index !== 0) index -= 1;
  };

  const handleKeydown = (event) => {
    // event.key : 알파벳
    // toUpperCase() : 대문자로 변경
    const key = event.key.toUpperCase();
    // event.keyCode : 키코드
    const keyCode = event.keyCode;
    // data-index="(몇번째시도)(몇글자입력)"인 자리에
    const thisBlock = document.querySelector(
      `.board-column[data-index='${attempts}${index}']`
    );

    // 백스페이스를 눌렀을때 다른 로직은 실행되지 않게
    // 다른 로직들이랑 if / else if 로 묶어줌
    if (event.key === "Backspace") handleBackspace();
    // 인덱스값이 5인순간(5글자가 입력되고 난 뒤 입력하면)
    else if (index === 5) {
      // 키코드는 대문자도 구별함
      // 엔터키를 눌렀으면 정답확인
      if (event.key === "Enter") handleEnterKey();
      // 엔터키가 아니면
      // 아무것도 실행되지 않음 (로직 실행 안됨)
      else return;
    }
    // 알파벳만 입력되게 (keycode 65 : a, keycode 90 : z)
    // && -> 모든 조건이 만족
    else if (65 <= keyCode && keyCode <= 90) {
      // 메인 블록에 텍스트 입력
      thisBlock.innerText = key;
      // 글자가 하나 입력되면 다음칸으로 이동
      // 3가지 다 같은 표현이라고 볼수있음
      // index = index + 1
      // index += 1;
      index++;
    }
  };

  /*-----------------------------------------
   *	스스로 코딩 (키보드 클릭 가능)
   *	신입연수원 day4 팀장님 지시 업무 ①
   */
  // 키보드 클릭 함수
  const handleKeyClick = (event) => {
    // 현재 클릭한 키보드의 data-key값 가져오기
    const clickKey = event.target.dataset.key;
    // console.log(clickKey);
    // thisBlock이랑 같은 건데 변수명 다르게
    const currentBlock = document.querySelector(
      `.board-column[data-index='${attempts}${index}']`
    );

    // Backspace 클릭하면 handleBackspace 함수 실행
    // (keydown 이벤트 때 만들어놓음)
    if (clickKey === "Backspace") handleBackspace();
    // 인덱스값이 5인순간(5글자가 입력되고 난 뒤 입력하면)
    else if (index === 5) {
      // 엔터키를 눌렀으면 정답확인
      // (keydown 이벤트 때 만들어놓음)
      if (clickKey === "Enter") handleEnterKey();
      // 엔터를 클릭한게 아니면
      // 아무것도 실행되지 않음 (로직 실행 안됨)
      else return;
      // 알파벳만 입력되게 (백스페이스랑 엔터를 클릭한게 아니라면)
    } else if (clickKey !== "Backspace" && clickKey !== "Enter") {
      // 메인 블록에 텍스트 입력 -> data-key값
      currentBlock.innerText = clickKey;
      index++;
    }
  };
  /*---------------------------------------*/

  // keyboard-column 28개를 다 찾아서 한묶음으로 가지고 있다가
  const keyboardColumns = document.querySelectorAll(".keyboard-column");
  //console.log(keyboardColumns);
  // 각각 keyboardColumn 객체로 받아서 한번씩 로직 실행함
  keyboardColumns.forEach(function (keyboardColumn) {
    keyboardColumn.addEventListener("click", handleKeyClick);
    //console.log(keyboardColumn);
  });

  // 타이머 함수
  const startTimer = () => {
    const 시작_시간 = new Date();

    function setTime() {
      const 현재_시간 = new Date();
      const 흐른_시간 = new Date(현재_시간 - 시작_시간);
      const 분 = 흐른_시간.getMinutes().toString().padStart(2, "0");
      const 초 = 흐른_시간.getSeconds().toString().padStart(2, "0");
      const timeDiv = document.querySelector("#timer");
      timeDiv.innerText = `${분}:${초}`;
    }

    timer = setInterval(setTime, 1000);
    // setInterval의 id -> 몇번째 interval이 돌고 있는지 알려줌
    // console.log(timer);
  };

  // 타이머 함수 실행
  startTimer();
  // addEventListener 안에 들어가는 함수는 암묵적으로 이벤트가 전달됨
  window.addEventListener("keydown", handleKeydown);
}

appStart();
