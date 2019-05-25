import Vue  from "vue"
import Vuex from "vuex"

Vue.use(Vuex);
const apiurl = 'https://api.wulv5.com/music'

export default new Vuex.Store({
	// 全局变量
	state: {
		// 创建音频标签
		audio: uni.createInnerAudioContext(),
		// 歌曲详情
		details: {},
		// 是否为暂停状态
		paused: true,
		// 歌词
		lrc: {},
		// 历史记录
		history: [],
		// 播放模式
		// 0.列表循环; 1.单曲循环; 2.随机播放; 3.顺序播放;
		styleMode: 0,
		styleList: [
			{name:'列表循环',iconUrl:'../../static/loop.png'},
			{name:'单曲循环',iconUrl:'../../static/singleLoop.png'},
			{name:'随机播放',iconUrl:'../../static/randomLoop.png'},
			{name:'顺序播放',iconUrl:'../../static/orderPlay.png'}
		],
		// 歌曲下标
		musicIndex: 0
	},
	mutations: {
		setSrc(state, src){
			// 第一个参数是固定的，我们自己传的参数从第二个开始
			state.audio.src = src;
			state.audio.play();
			state.paused = false;
		},
		setDetail(state, detail){
			state.details = detail;
		},
		setLrc(state, olrc){
			state.lrc = olrc;
		},
		setHistory(state, data){
			let flag = state.history.findIndex((item)=>{
				return data[1].id === item.detail.id;
			});
			flag && state.history.unshift({
				mp3Url: data[0],
				detail: data[1],
				lrc: data[2]
			});
		},
		setStyleMode(state){
			state.styleMode = ++state.styleMode % state.styleList.length;
		},
		play(state){
			state.audio.play();
			state.paused = false;
		},
		pause(state){
			state.audio.pause();
			state.paused = true;
		},
		setMusicIndex(state, addi){
			switch(state.styleMode){
				case 0: //列表循环
					state.musicIndex = addi<0&&state.musicIndex===0 ? state.history.length-1 : (state.musicIndex+addi)%state.history.length;
					break;
				case 1: //单曲循环
					break;
				case 2: //随机播放
					var temp = parseInt(Math.random()*state.history.length);
					while(temp===state.musicIndex) temp = parseInt(Math.random()*state.history.length);
					state.musicIndex = temp;
					break;
				case 3: //顺序播放
					state.musicIndex = state.musicIndex+addi<0 || state.musicIndex+addi>state.history.length-1 ? state.musicIndex : state.musicIndex+addi;
					break;
				default: //错误
					break;
			}
		}
	},
	actions: {
		getSrc({commit, dispatch}, item){
			// 第一个参数是固定的，我们自己传的参数从第二个开始
			// commit 用来执行mutations里面的函数
			// dispatch 用来执行actions里面的其它函数
			
			Promise.all([
				new Promise((next, err)=>{
					// 获取音乐地址
					uni.request({
						url: apiurl + `/song/url?id=${item.id}`,
						success: (res)=>{
							// console.log(res);
							commit('setSrc', res.data.data[0].url);
							next(res.data.data[0].url);
						}
					});
				}),
				new Promise((next, err)=>{
					// 获取音乐详情
					uni.request({
						url: apiurl + `/song/detail?ids=${item.id}`,
						success: (res)=>{
							// console.log(res.data);
							var detail = {
								id: res.data.songs[0].id,
								picUrl: res.data.songs[0].al.picUrl,
								name: res.data.songs[0].name,
								author: res.data.songs[0].ar[0].name
							};
							commit('setDetail', detail);
							next(detail);
						}
					});
				}),
				new Promise((next, err)=>{
					// 获取歌词
					uni.request({
						url: apiurl + `/lyric?id=${item.id}`,
						success: (res)=>{
							commit('setLrc', res.data.lrc.lyric);
							next(res.data.lrc.lyric);
						}
					});
				})
			]).then((data)=>{
				commit('setHistory', data);
			});
		}
	}
});