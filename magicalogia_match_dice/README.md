## 소개
마도서대전 RPG 마기카로기아를 Roll20에서 ORPG로 진행할 때  
스펠바운드에 플롯된 다이스를 집계한 뒤 공방판정 후 남은 다이스를 채팅창에 표시하는 기능입니다.

## 사용법

**준비1. 다이스 덱 만들기**
1. roll20 세션방에서 공격-방어에 사용하는 다이스를 Card 덱으로 생성하고 덱의 이름을 Dice로 지정합니다.
2. 주사위 눈에 맞게 Card를 생성하고 이름을 눈에 맞는 숫자로 설정합니다.  
   이 스크립트로 랜덤플롯을 이용하고 싶으시다면 이름을 '?'(물음표)로 갖는 Card를 추가로 1개 만들어주세요.  
   일반적으로는 1-6번과 집중방어(0번),랜덤 다이스(?번)를 포함해 총 8개가 됩니다.
3. 완성입니다. 플레이어와 GM은 화면에 다이스를 플롯할 때 이 덱을 사용합니다.

   또한 스크립트는 덱에 입력한 눈의 숫자를 바탕으로 화면에 놓인 주사위의 눈을 파악할 것입니다.


**준비2. 플롯 영역 설정하기**

1. roll20 세션방의 전투맵 페이지를 엽니다.
2. 임의의 사각형 모양의 토큰을 생성한 뒤 주사위를 플롯하는 좌표에 맞게 사이즈와 위치를 조절해 배치합니다.  
   (위치는 맵 레이어가 가장 적당합니다. 투명한 png 파일을 사용하시는 것도 추천합니다.)
3. 1팀 대표(일반적으로 PC 마법전 대표)의 플롯영역을 덮는 토큰의 이름을 `A_delegate`로 설정합니다.
4. 2팀 대표(일반적으로 에너미)의 플롯영역을 덮는 토큰의 이름을 `B_delegate`로 설정합니다.
5. 1팀 입회인(일반적으로 PC 입회인)의 플롯영역을 덮는 토큰의 이름을 `A_observer`로 설정합니다.
6. 2팀 입회인(일반적으로 잘 쓰이지 않으나 에너미 혹은 pvp상대의 입회인) 영역은 `B_observer`로 설정합니다.
7. 스펠바운드의 배열상 한 사각형 안에 플롯영역이 모두 담기지 않을 경우  
   같은 이름을 공통으로 쓰는 사각형을 필요한 만큼 여럿 만드시면 됩니다.
8. 플롯할 칸에 영역토큰을 하나씩 배치하기 보다는 토큰의 크기를 늘려서 한 토큰 안에 가급적 여러 칸이 포함되도록 배치하는 쪽이 안정적으로 동작합니다.  
   이 때 의도하는 플롯영역에서 넘치지는 않게 배치해주세요.
9. 완성입니다. 이제 스크립트에서는 각 주사위들이 어느 사각형 위에 있는가를 보고 진영과 입회여부 등을 파악하게 됩니다.

**준비3. 스크립트 적용하기**
1. 세션방의 대문에 해당하는 페이지에서 [설정]->[API 스크립트]를 선택해 스크립트 수정 페이지로 들어갑니다. (PRO 계정에서만 이 메뉴가 보입니다.)
2. 기존에 스크립트가 있는 탭이나 New Script에 [[ magicalogia_match_dice.js ]](https://github.com/kibkibe/roll20-api-scripts/blob/master/magicalogia_match_dice/magicalogia_match_dice.js)의 코드들을 복사해 붙여놓고 [Save Script]로 저장합니다. 
3. 페이지 아래쪽의 API Output Console에 에러 메시지가 표시되지 않는다면 정상적으로 적용된 것입니다. 세션방에서 테스트를 진행할 수 있습니다.
4. 설정한 스펠바운드에 맞게 주사위를 플롯한 뒤 채팅창에 `!match_dice`의 형식으로 입력해 테스트를 해봅니다.
	
## 옵션
### 자동 뒤집기
명령어에 `flip`을 추가하면 뒷면이 보이도록 놓인 주사위도 앞면으로 뒤집은 후에 매칭합니다.

		!match_dice flip

> 채팅창에 명령어를 모두 입력하는 것이 불편하다면 매크로를 이용하시는 것도 추천합니다.

### 주사위 삭제하기
`!clear_dice` 명령어로 맵에 놓인 주사위들을 일괄 삭제할 수 있습니다.

		!clear_dice

명령어에 `remain_gm_dice`를 추가하면 조작권한이 `모든 플레이어`가 아닌 주사위는 남겨놓고 삭제합니다.    
가령 단장의 플롯을 위한 랜덤주사위는 남겨두고 싶을 경우, 에너미 플롯영역에 놓인 랜덤주사위 토큰의 `제어 권한`에서 `모든 플레이어`를 지운 뒤 아래 명령어를 사용하면 플레이어 주사위만 삭제할 수 있습니다.

		!clear_dice remain_gm_dice

### 매칭 권한 제한하기
다이스 매치 명령을 GM만 사용할 수 있도록 제한하고 싶다면 코드 상단의 `is_gm_only`를 true로 설정합니다.