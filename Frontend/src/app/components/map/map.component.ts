import { Station } from './../../../utils/Station';
import { AfterViewInit, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Map, Marker, marker, tileLayer } from 'leaflet';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
	@Input() stations: Station[];

	@Output() onStationSelect: EventEmitter<string> = new EventEmitter();

	markers: Marker[];
	private map: Map;
	ngAfterViewInit(): void {
		this.map = new Map('map').setView([42.975542, 12.46655], 6);
		tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 20,
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(this.map);

		// const markerItem = marker([51.5, -0.09]).addTo(map);

		// map.fitBounds([[markerItem.getLatLng().lat, markerItem.getLatLng().lng]]);
	}
	addMarkers(st: Station[]) {
		if (st.length > 0) {
			this.map.setView([st[0].latitude, st[0].longitude], 12);
		}
		st.forEach((station: Station) => {
			let new_marker = marker([station.latitude, station.longitude])
				.bindPopup(station.name)
				.addTo(this.map)
				.on('click', (st) => {
					let stt = st.target._popup._content;

					this.onStationSelect.emit(stt);
				});
		});
	}
}
