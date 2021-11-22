import { Station } from './../../../utils/Station';
import { AfterViewInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { Map, Marker, marker, tileLayer, Icon, LayerGroup, featureGroup, Point } from 'leaflet';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
	@Input() stations: Station[];

	@Output() onStationSelect: EventEmitter<string> = new EventEmitter();

	private all_markers: Marker[] = [];

	private map: Map;
	private layerGroup: LayerGroup;

	private red = '../../../assets/map-icon-red.png';
	private blue = '../../../assets/map-icon-blue.png';

	private red_icon: Icon = new Icon({
		iconUrl: this.red,
		className: 'active',
	});
	private blue_icon: Icon = new Icon({
		iconUrl: this.blue,
		className: 'inactive',
	});

	ngAfterViewInit(): void {
		this.map = new Map('map').setView([41.940685, 12.485678], 7);
		this.layerGroup = new LayerGroup().addTo(this.map);

		tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(this.map);
	}

	addMarkers(st: Station[]) {
		if (st.length > 0) {
			this.map.setView([st[0].latitude, st[0].longitude], 12, {
				animate: true,
			});
		}
		st.forEach((station: Station) => {
			this.setMarker(station.latitude, station.longitude, station.name, this.blue_icon);
		});

		var group = featureGroup(this.all_markers).addTo(this.map);
		this.map.fitBounds(group.getBounds(), {
			padding: new Point(0, 25),
		});
	}

	private setMarker(lat: number, lng: number, title: string, icon: Icon) {
		let _marker = marker([lat, lng], {
			icon: icon,
			title: title,
		})
			.bindPopup(title)
			.addTo(this.layerGroup)
			.on('click', (st) => {
				let is_active;
				let title = st.target.options.title;
				this.all_markers.forEach((x) => {
					let x_active = x.getIcon().options.className == 'active' ? true : false;
					if (x.options.title === title) {
						is_active = x_active;
						x.setIcon(is_active ? this.blue_icon : this.red_icon);
					} else {
						x.setIcon(this.blue_icon);
					}
				});
				this.onStationSelect.emit(!is_active ? title : undefined);
			});
		this.all_markers.push(_marker);
	}
}

export interface _Marker {
	name: string;
	lat: number;
	lng: number;
	isActive: boolean;
}
