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
	});
	private blue_icon: Icon = new Icon({
		iconUrl: this.blue,
	});

	ngAfterViewInit(): void {
		this.map = new Map('map').setView([42.975542, 12.46655], 6);
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
			padding: new Point(0, 30),
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
				let selected_station = st.target._popup._content;

				let new_markers: _Marker[] = [];

				let title = st.target.options.title;

				this.all_markers.forEach((m) => {
					new_markers.push({
						name: m.options.title ? m.options.title : '',
						lat: m.getLatLng().lat,
						lng: m.getLatLng().lng,
						isActive: m.options.title === title,
					});
				});

				this.updateHandler(new_markers);
				this.onStationSelect.emit(selected_station);
			});
		this.all_markers.push(_marker);
	}

	private updateHandler(mkrs: _Marker[]) {
		this.layerGroup.clearLayers();
		this.all_markers = [];
		mkrs.forEach((m: _Marker) => {
			this.setMarker(m.lat, m.lng, m.name, m.isActive ? this.red_icon : this.blue_icon);
		});
	}
}

export interface _Marker {
	name: string;
	lat: number;
	lng: number;
	isActive: boolean;
}
