import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [CommonModule, RouterOutlet],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
	title = 'PPPOverlay';
	arrData: PPPData[] = [];
	isSongRunning: boolean = false;
	showPB: boolean = false;
	settings: Settings = new Settings();
	//#region 
	isConnected = false;
	//#endregion
	//#region styles
	ppSpaceStyle = "0ch";
	ppGainSpaceStyle = "5ch";
	textSpaceStyle = "0ch"
	//#endregion

	constructor() {
	}

	addTestData() {
		this.arrData.push({ leaderboardName: "BeatLeader", pp: 123.23, ppGain: 0, personalBest: "123 pp", isRanked: true })
		this.arrData.push({ leaderboardName: "ScoreSaber", pp: 119023.23, ppGain: 1, personalBest: "--- pp", isRanked: true, maxPP: 111000, ppSuffix: "pp" })
		this.arrData.push({ leaderboardName: "HitBloq", pp: 123.23, personalBest: "--- pp", isRanked: true, iconPath: "https://imgur.com/5bxRBQV" })
		this.updateStyles();
		this.isSongRunning = true;
					this.showPB = true;
					setTimeout(() => {
						this.showPB = false;
					}, 1000);
					this.isConnected = true;
	}

	ngAfterViewInit(): void {
		this.loadSettings();
		this.connect();
		//this.addTestData();
	}

	connect() {
		console.log("connect start");

		var socket = new WebSocket(`ws://${this.settings.ip}:${this.settings.port}/socket`);

		socket.addEventListener("open", () => {
			console.log("WebSocket opened");
			this.isConnected = true;
		});

		socket.addEventListener("message", (message) => {
			let m: MessageContainer = JSON.parse(message.data);
			//console.log(m.messageType);
			switch (m.messageType) {
				case "OnGameplayInfoChanged":
					this.arrData = m.payload;
					this.updateStyles();
					break;
				case "OnSongFinished":
					this.isSongRunning = false;
					this.arrData = [];
					break;
				case "OnSongStarted":
					this.isSongRunning = true;
					this.showPB = true;
					setTimeout(() => {
						this.showPB = false;
					}, 5000);
					break;
				case "OnFirstNoteHit":
					this.showPB = false;
					break;
				case "OnLastNoteHit":

					break;
				case "OnResumed":

					break;
				case "OnPaused":

					break;
				default:
					break;
			}
		});

		socket.addEventListener("close", () => {
			this.isConnected = false;
			console.log("Failed to connect to server, retrying in 3 seconds");
			setTimeout(() => this.connect(), 3000);
		});
	}

	updateStyles(){
		let maxMax = Math.max(...this.arrData.map(x => x.maxPP ?? 0)).toString()
		let maxLength = maxMax.length + 2; //space for 'pp'
		if(maxMax.indexOf('.') == -1 && maxMax.indexOf(',') == -1){
			maxLength += 3; //add space for x.23 pp
		}
		this.ppSpaceStyle = `${maxLength}ch`;
		this.textSpaceStyle = `${maxLength+7}ch`;
	}

	styleGain(item: PPPData): string{
		if(item.ppGain??0 > 0){
			return "green";
		}
		return "";
	}

	loadSettings() {
		this.settings = new Settings();

		let queryString = window.location.search;
		let urlParams = new URLSearchParams(queryString);
		let ip = urlParams.get('ip');
		let port = urlParams.get('port');
		let position = urlParams.get('position');
		let showGains = urlParams.get('showGains');
		let backgroundStyle = urlParams.get('backgroundStyle');

		if (ip) this.settings.ip = ip;
		if (port) this.settings.port = port;
		if (position) this.settings.position = position;
		if (showGains) this.settings.showGains = showGains == "true";
		if (backgroundStyle) this.settings.backgroundStyle = backgroundStyle;
	}
}

export class MessageContainer {
	messageType: string = "";
	payload: PPPData[] = [];
}

export class PPPData {
	leaderboardName?: string = "";
	pp?: number = 0;
	ppGain?: number = 0;;
	maxPP?: number = 0;;
	targetPercentage?: number = 0;;
	percentage?: number = 0;;
	ppSuffix?: string = "";
	personalBest?: string = "";
	iconPath?: string = "";
	isRanked?: boolean = false;;
}

export class Settings {
	ip: string = "localhost";
	port: string = "6558";
	position: string = "bottomright";
	showGains: boolean = true;
	backgroundStyle: string = "none";
	hideSeconds: number = 5;
}