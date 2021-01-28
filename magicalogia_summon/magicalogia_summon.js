/* https://github.com/kibkibe/roll20-api-scripts/tree/master/magicalogia_summon */
/* (magicalogia_summon.js) 210128 코드 시작 */
on("chat:message", function(msg)
{
if (msg.type == "api"){
	const ms_command = "!소환"; //명령어는 변경하셔도 됩니다. 시작은 무조건 느낌표.
	const mr_command = "!저항 ";
	// TATECK님의 커스텀 시트를 사용하는지(true) 공개버전 시트를 사용하는지(false) 설정합니다.
	const use_custom_sheet = false; 

	if (msg.content.indexOf(ms_command) == 0) { 
		try {
			//원형 표시 설정
			const display_type = true; // 원형의 타입명을 표시할지 (true) 생략할지 (false) 설정합니다.
			const display_skill = true; // 원형의 특기를 표시할지 (true) 생략할지 (false) 설정합니다.
			const use_effect_marker = true; // 원형의 이펙트를 토큰 마커로 표시할지 (true) 표시하지 않을지 (false) 설정합니다.
			const use_text = false;	// use_effect_marker가 true일 때: 이펙트의 숫자를 마커 위에 텍스트로 표시할지(true) 숫자가 포함된 이미지를 불러올지(false) 설정합니다.
									// use_effect_marker가 false일 때: 원형토큰의 이름에 이펙트를 기재할지(true) 생략할지(false) 설정합니다.
			const div_text = ",";	// 원형토큰의 이름에 이펙트를 기재하는 옵션일 경우, 이펙트 사이를 분리할 문자열을 설정합니다.
			
			const effect_list = [ // 사용할 이펙트 목록을 설정합니다.
				// marker: 사용할 마커의 이름입니다. 마커 이미지에 숫자가 포함된 경우 숫자를 제외한 이름만 입력해주세요.
				// display_name: 원형토큰의 이름에 이펙트를 기재하는 옵션일 경우, 해당 이펙트를 기재하는데 사용할 단어를 설정합니다.
				// keyword: 해당 이펙트를 인식할 약칭들을 설정합니다. 콤마(,)로 구분합니다.
				// use_bar: 이 값이 true로 설정된 이펙트는 마커나 이름표 대신 토큰의 Bar로 표시됩니다.
				// non_numbering: 이 값이 true로 설정된 이펙트는 뒤에 숫자가 붙지 않습니다.
				{marker:'block',display_name:'블',keyword:'block,bl,블록,블',use_bar:true},
				{marker:'damage',display_name:'추댐',keyword:'damage,da,추가대미지,대미지,추가데미지,데미지,추댐,추뎀,추'},
				{marker:'boost',display_name:'부',keyword:'boost,bo,부스트,부슽,부'},
				{marker:'cast',display_name:'캐',keyword:'cast,ca,캐스트,캐슽,캐',non_numbering:true},
				{marker:'mana',display_name:'마',keyword:'mana,ma,마나,마'},
				{marker:'word',display_name:'워',keyword:'word,wo,워드,워'},
				{marker:'minus',display_name:'-',keyword:'minus,mi,마이너스,-'},
				{marker:'plus',display_name:'+',keyword:'plus,pl,플러스,플,+'},
				{marker:'spellguard',display_name:'가',keyword:'spellguard,sp,스펠가드,가,가드,스'}]; 

			// 생성될 토큰의 옵션을 설정합니다.
			let opt = {
				left: 1000+Math.random()*70, //원형이 소환되면 기본적으로 배치될 가로 위치
				top: 200+Math.random()*70, //원형이 소환되면 기본적으로 배치될 세로 위치
				width: 90, //소환할 원형 토큰의 가로크기
				height: 90, //소환할 원형 토큰의 세로크기
				showname: true, //이름표 사용 여부 (true/false)
				showplayers_name: true, //플레이어에게 이름표를 보일지 여부 (true/false)
				bar1_value: 0,
				controlledby:"all",
				pageid: Campaign().get("playerpageid"),
				statusmarkers: "",
				layer: "objects"
			};

			const default_tokens = ["red", "blue", "green", "brown", "purple", "pink", "yellow"];
			const archetype_list = [
				{name:'정령', effect:'block2'},
				{name:'마검', effect:'damage1'},
				{name:'악몽', effect:'minus2'},
				{name:'기사', effect:'block1,damage1,boost1'},
				{name:'처녀', effect:'block1,cast,word7'},
				{name:'전차', effect:'block2,mana1'},
				{name:'마왕', effect:'block2,damage2,boost1'},
				{name:'군단', effect:'block3,damage1,word6'},
				{name:'왕국', effect:'block3,cast,mana1,boost2'},
				{name:'마신', effect:'block3,damage3,cast,plus3,minus3,boost1'},
				{name:'나락문', effect:''}
			];

			//명령형식 !소환 --정적 --마검 --cast,mana1,damage2
			// 타입, 특기 판별
			// 분할결과가 2개밖에 없을 경우 나락문으로 판단하고 타입만 추출
			let section = msg.content.split(/\s*--/g);
			let skill, type;
			let split = "";
			let effects = [];
			if (section.length < 3) {
				type = section[1];
			} else {
				skill = section[1];
				type = section[2];
				// 해당 아키타입이 보유한 기본 이펙트를 추출					
				const archetype = archetype_list.find(archetype => archetype.name == type);
				if (!archetype) {
					// 적절한 아키타입이 없으면 오류 출력
					return;
				} else {
					split += archetype.effect;
				}
				// 성장치가 붙은 경우 파싱
				if (section.length > 3) {
					split += "," + section[3]
				}
			}
				
			opt.name = (skill && display_skill ? skill+ (type && display_type ? "의 ":"") : "") + (type && display_type ? type:''); // display_type과 display_skill에 따라 표시
			const token_markers = JSON.parse(Campaign().get("token_markers"));
			
			if (use_effect_marker || use_text) {

				// string을 배열화
				split = split.split(/\s*,\s*/g);
	
				// 캠페인에서 사용할 수 있는 마커 목록 불러오기
	
				// 이펙트 추출
				for (let index = 0; index < split.length; index++) {
					const element = split[index];
					const effect = element.replace(/\d/g,'');
					let number = element.replace(effect,'');
					
					// name과 keyword를 바탕으로 이펙트 검색
					for (let i = 0; i < effect_list.length; i++) {
						const fx = effect_list[i];
						// effect_list에 포함된 이벤트 검색
						if (effect == fx.marker || fx.keyword.split(",").indexOf(effect) > -1) {
							number = fx.non_numbering ? '' : number;
							let fx_obj = {display_name:fx.display_name,number:number};
							let duplicated_index = -1;
							for (let j = 0; j < effects.length; j++) {
								if (fx.display_name == effects[j].display_name) {
									duplicated_index = j;
									if (!fx.non_numbering) {
										number = (parseInt(effects[j].number) + parseInt(number.length>0?number:'0')) + "";
									}
									break;
								}
							}
							//숫자가 포함되었거나 non_numbering이 true인 이펙트일 경우 유효한 것으로 판단
							if (fx.use_bar && (number && number.length > 0)) { // Bar를 사용하는 이펙트일 경우
								opt.bar1_value += parseInt(number);
								opt.bar1_max = opt.bar1_value;
								opt.showplayers_bar1 = true;
							} else if (fx.non_numbering || (number && number.length > 0)) {
								let marker = token_markers.find(mark => mark.name == fx.marker+(use_text?'':number));
								if (!marker) {
									if (default_tokens.indexOf(fx.marker) > -1) {
										marker = {tag:fx.marker};
									} else {
										sendChat('error',"/w GM 사용할 수 있는 마커 중 이름이 **"+fx.marker+(use_text?'':number)+"**인 항목이 없습니다.",null,{noarchive:true});
										return;
									}
								}
								if (use_effect_marker) {
									fx_obj.value = (use_text ?
										(marker.tag + (number.length>0?"@":'') + number) :
										marker.tag);
								} else {
									fx_obj.value = fx.display_name+number;
								}
								if (duplicated_index > -1) {
									effects.splice(duplicated_index,1,fx_obj);
								} else {
									effects.push(fx_obj);
								}
							}
						}
					}
				}
				// 가공된 effect를 |로 join
				if (use_effect_marker) { // createObj의 statusmarkers에 포함
					effects.forEach(element => {
						opt.statusmarkers += "," + element.value;
					});
					opt.statusmarkers = opt.statusmarkers.length > 0 ? opt.statusmarkers.substring(1) : '';
				} else if (use_text) { // 마커를 사용하지 않지만 원형 이름에 텍스트로 이펙트를 보여줄 경우
					opt.name = opt.name + (opt.name.length > 0 ? "" : "/") + effects.join(div_text);
				}				
			}

			//덱의 이름(name: 'archetype')은 변경하셔도 좋습니다. 사용할 세션방의 덱 이름과 일치시켜 주세요.
			var archetype_deck = findObjs({ _type: 'deck', name: 'archetype'})[0];
			var archetype = findObjs({ _type: "card", _deckid: archetype_deck.get('_id'), name:type});
			if (archetype.length > 0) {
				opt.imgsrc = archetype[0].get('avatar').replace("med","thumb").replace("max","thumb");
				opt.gmnotes = (skill ? skill : '') + "," + type;
				createObj("graphic", opt);
			} else {
				sendChat('error',"/w GM 원형 타입 <"+type+">가 존재하지 않습니다.",null,{noarchive:true});
			}  
		} catch (err) {
			sendChat('error','/w GM '+err,null,{noarchive:true});
		}
	} else if (msg.content.indexOf(mr_command) === 0) { //명령어는 변경하셔도 됩니다. 시작은 무조건 느낌표.
        try {
            const table = [
                ['황금','대지','숲','길','바다','정적','비','폭풍','태양','천공','이계'],
                ['살','벌레','꽃','피','비늘','혼돈','이빨','외침','분노','날개','에로스'],
                ['중력','바람','흐름','물','파문','자유','충격','우레','불','빛','원환'],
                ['이야기','선율','눈물','이별','미소','마음','승리','사랑','정열','치유','시간'],
                ['추억','수수께끼','거짓','불안','잠','우연','환각','광기','기도','희망','미래'],
                ['심연','부패','배신','방황','나태','왜곡','불행','바보','악의','절망','죽음']
            ];
            if (msg.selected.length > 0) {
                for (let i = 0; i < msg.selected.length; i++) {
                    const tok = getObj("graphic", msg.selected[i]._id);
                    const gmnotes = unescape(tok.get('gmnotes')).replace(/(<([^>]+)>)/gi, "");
                    if (!gmnotes || gmnotes.length==0 || gmnotes.indexOf(',') < 0) {
                        sendChat('error','/w GM **' + tok.get('name')  + '**은 원형토큰이 아니거나 GM 노트에서 원형의 특기와 타입을 가져올 수 없습니다.',null,{noarchive:true});
                        return;
                    }
                    const split = gmnotes.split(',');
                    const name = split[0];
                    const type = split[1];
                    const target = msg.content.replace(mr_command,'');
                    if (!name || !target || name.length == 0 || target.length == 0) {
                        sendChat('error','/w GM 원형의 특기를 가져올 수 없습니다.',null,{noarchive:true});
                        return;
                    }
                    let target_x=-1;
                    let target_y=-1;
                    let arche_x=-1;
                    let arche_y=-1;
                    for (let i=0;i<table.length;i++) {
                        for (let j=0;j<table[i].length;j++) {
                            if (table[i][j] === target) {
                                target_x = i;
                                target_y = j;
                            }
                            if (table[i][j] === name) {
                                arche_x = i;
                                arche_y = j;
                            }
                        }
                    }
                    if (target_x == -1 || target_y == -1 || arche_x == -1 || arche_y == -1) { sendChat('error','/w GM 원형 혹은 판정할 특기의 이름이 잘못되었습니다.',null,{noarchive:true}); return;}
                    let res_target = 5 + Math.abs(target_x-arche_x)*2 + Math.abs(target_y-arche_y);
                    if (target_x != arche_x) { res_target -= 1; }
                    if (res_target > 12) { res_target = 12; }
                    if (use_custom_sheet) {
                        sendChat(name + "의 " + type, "&{template:MagiDice} {{name=" + name + "의 " + type + "}} {{spec=" + target + "}}{{target=[[" + res_target + "]]}}{{roll1=[[1d6]]}}{{roll2=[[1d6]]}}");
                    } else {
                        sendChat(name + "의 " + type, "&{template:Magic} {{name=" + name + "의 " + type + "}} {{skillname=" + target + "}}{{target=[[" + res_target + "]]}}{{roll=[[1d6]],[[1d6]]}}");
                    }
                }
            } else {
                sendChat('error','/w GM 선택된 원형 토큰이 없습니다.',null,{noarchive:true});
            }
            
        } catch (err) {
            sendChat('error','/w GM '+err,null,{noarchive:true});
        }
    }
}
});
/* (magicalogia_summon.js) 210128 코드 종료 */