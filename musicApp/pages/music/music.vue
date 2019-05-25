<template>
	<view>
		<view class="music-pic">
			<image :src="details.picUrl"  lazy-load="true"></image>
		</view>
		<view class="progress">
			<view class="time currentTime">{{ current }}</view>
			<view class="oslider"><slider @changing="changing" @change="change" :value="value" block-size='12'/></view>
			<view class="time duration">{{ duration }}</view>
		</view>
		<view class="control">
			<view><image @click.stop="setStyleMode()" class="control-style" :src="styleList[styleMode].iconUrl" :alt="styleList[styleMode].name"></image></view>
			<view><image @click.stop="prev()" class="control-pre" src="../../static/prev.png"></image></view>
			<view><image @click.stop="paused?play():pause()" class="control-play" :src="'../../static/'+ (paused ? 'paused' : 'play') +'.png'"></image></view>
			<view><image @click.stop="next()" class="control-pre" src="../../static/next.png"></image></view>
			<view><image @click.stop="download()" class="control-download" src="../../static/download.png"></image></view>
			<view><image class="control-menu" src="../../static/menu.png"></image></view>
		</view>
		<view class="music-lrc">
			<ul :style="'margin-top:-'+ index*28 +'px'">
				<li :class="index===i && 'on' "  v-for="(item, i) in mlrc" :key="i">{{ item.text }}</li>
			</ul>
		</view>
	</view>
</template>

<script>
	import Vuex from "vuex"
	export default {
		computed: {
			...Vuex.mapState(["audio", "details", "paused", "lrc", "styleMode", "styleList", "musicIndex", "history"])
		},
		data() {
			return {
				current: "00:00",
				duration: "00:00",
				updateState: true,
				value: 0,
				// 标记第几句歌词
				index: -1,
				mlrc: []
			}
		},
		mounted(){
			this.drawInit();
			this.audio.onEnded(()=>{
				this.drawInit();
				this.setMusicIndex(1);
				this.setSrc(this.history[this.musicIndex].mp3Url);
				this.setDetail(this.history[this.musicIndex].detail);
				this.setLrc(this.history[this.musicIndex].lrc);
			});
			this.audio.onPlay(this.drawInit);
			
			// 自动改变歌词版面高度
// 			let lrcbox = document.querySelector(".music-lrc");
// 			this.lrcheight =  window.innerHeight - lrcbox.offsetTop - 150;
// 			console.log(this.lrcheight);
// 			lrcbox.style.height = this.lrcheight + "px";
			
			this.audio.onTimeUpdate(this.getCurrentTime);	
		},
		methods: {
			...Vuex.mapMutations(["play", "pause", "setSrc", "setDetail", "setLrc", "setStyleMode", "setMusicIndex", "prev"]),
			drawInit(){
				this.index = -1;
				// 歌名
				uni.setNavigationBarTitle({
					title: this.details.name
				});
				// 歌词
				let arr = this.lrc.split("\n");
				arr.forEach((item, i)=>{
					let temp = item.split("]");
					arr[i] = {
						time: temp[0].substring(1, temp[0].length-1),
						text: temp[1]
					};
				});
				this.mlrc = arr;
			},
			timeToString(time){
				let min = parseInt(time / 60),
					sec = parseInt(time % 60);
				return `${min<10?0+""+min:min}:${sec<10?0+""+sec:sec}`;
			},
			getCurrentTime(){
				// 歌曲时间
				this.current = this.timeToString(this.audio.currentTime || 0);
				this.duration = this.timeToString(this.audio.duration || 0);
				// 进度条进度
				if(this.updateState){
					this.value = this.audio.currentTime / this.audio.duration * 100;
				}
				// 歌词显示
				if( this.index<this.mlrc.length-1 ){
					if( this.mlrc[this.index+1].time < this.current || /[a-z]+/i.test(this.mlrc[this.index+1].time) )
						this.index++;
				}
			},
			change(e){
				let t = e.detail.value / 100 * this.audio.duration;
				this.audio.seek(t);
				this.updateState = true;
			
				const self = this;
				let s = this.timeToString(t);
				this.index = 0;
				(function d(){
					if( self.index<self.mlrc.length-1 ){
						if( self.mlrc[self.index+1].time < s || /[a-z]+/i.test(self.mlrc[self.index+1].time) ){
							self.index++;
							d();
						}
					}
				})();
			},
			changing(){
				this.updateState = false;
			},
			prev(){
				this.setMusicIndex(-1);		
				this.setSrc(this.history[this.musicIndex].mp3Url);
				this.setDetail(this.history[this.musicIndex].detail);
				this.setLrc(this.history[this.musicIndex].lrc);
			},
			next(){
				this.setMusicIndex(1);		
				this.setSrc(this.history[this.musicIndex].mp3Url);
				this.setDetail(this.history[this.musicIndex].detail);
				this.setLrc(this.history[this.musicIndex].lrc);
			},
			download(){
				uni.downloadFile({
					url: this.audio.src,
					success:(res)=>{
						console.log(res);
						// 浏览器下载方式
// 						var a = document.createElement('a');
// 						a.href = res.tempFilePath;
// 						a.download = this.details.name + '.mp3'
// 						a.click()
						// 手机app下载方式 永久保存
						uni.saveFile({
							tempFilePath: res.tempFilePath
						});
					}
				});
			}
		}
	}
</script>

<style>
	.music-pic{
		width:200upx;
		height:200upx;
		margin:10upx auto;
		border-radius:50%;
		overflow:hidden;
	}
	.music-pic image{
		width:100%;
	}
	.progress{
		display:flex;
		justify-content: center;
		padding:0 20px;
	}
	.progress>view{
		flex-direction:column;
		flex-wrap:nowrap;
		align-items:center;
	}
	.time{
		color:#515151;
		font-size:10px;
	}
	.oslider{
		width:100%;
	}
	.oslider slider{
		margin:0 10px;
	}
	.control{
		display:flex;
		justify-content: center;
		padding:0 10px;
	}	
	.control>view{
		display:inline-block;
		width:20%;
		text-align:center;
		line-height: 56px;		
		flex-direction:column;
		flex-wrap:nowrap;
		align-items:center;
	}
	.control image{
		display:inline-block;
		width:20px;
		height:20px;
	}
	.music-lrc{
		position: relative;
		height: 200px;
		padding-top:120px;
		overflow: hidden;
	}	
	.music-lrc::before,
	.music-lrc::after{
		content:"";
		display:block;
		position: absolute;
		width: 100%;
		height:30px;
	}
	.music-lrc::before{
		top:0;
		background:linear-gradient(to bottom, rgba(255,255,255,.3), transparent);
	}
	.music-lrc::after{
		bottom:0;
		background:linear-gradient(to top, rgba(255,255,255,.3), transparent);
	}
	.music-lrc ul{
		padding:0 20px;
		transition: 1s;
	}
	.music-lrc li{
		list-style: none;
		font-size: 14px;
		text-align: center;
		line-height: 28px;
	}
	.music-lrc li.on{
		color:red;
		transition: .3s;
	}
</style>
