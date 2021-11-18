import { StationHourlyAvg } from 'src/utils/StationHourlyAvg';
import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { EChartsOption } from 'echarts';
import { Chart_custom } from 'src/utils/Chart-class';

@Component({
	selector: 'app-linechart',
	templateUrl: './linechart.component.html',
	styleUrls: ['./linechart.component.css'],
})
export class LinechartComponent implements OnInit {
	private chart_class: Chart_custom = new Chart_custom();

	station_values: string[] = ['CO2', 'T', 'RH', 'PM2.5', 'PM10'];
	private station_help_info: string[] = [
		'L’anidride carbonica (CO2) è tra i gas ad effetto serra (Greenhouse gas o GHG) che maggiormente contribuiscono al riscaldamento del pianeta.\nTali gas presenti nell’atmosfera terrestre catturano il calore del sole impedendogli di ritornare nello spazio. ',
		'T help',
		'RH help',
		'PM2.5 help',
		'PM10 help',
	];
	selected_sensor_type: string;

	private main_chart: any;
	chart_options: EChartsOption;

	@Input() data: StationHourlyAvg[] | null = null;
	@Input() enabled: boolean;

	help: string;

	constructor(private renderer: Renderer2) {
		this.renderer.listen('window', 'click', (e: Event) => {
			let info: any = e.target;
			let _id: string = info.id;

			let _class: string = info.classList[0];

			if (_class !== 'info-content' && _class !== 'info-icon' && _id !== 'info-content-shape') {
				this.infoDropdownRemove();
			}
		});
	}

	resolveHelpLabel() {
		return this.station_help_info[this.selected_sensor_type != '' ? this.station_values.indexOf(this.selected_sensor_type) : 0];
	}

	ngOnInit(): void {
		this.main_chart = null;
		this.chart_options = this.chart_class.newLineChart();
	}

	chartInit(ev: any) {
		this.main_chart = ev;
	}

	updateHandler(datas?: StationHourlyAvg[]) {
		if (datas) {
			this.data = datas;
			this.selected_sensor_type = '';
		}

		this.updateChart();
	}

	private updateChart() {
		let tmp_values =
			this.data == null
				? []
				: this.data.filter((obj) => {
						return obj.sensor.type == this.selected_sensor_type;
				  });

		let x: string[] = [];
		let y: number[] = [];
		let sensor_unit: string = '';

		if (tmp_values.length > 0) {
			sensor_unit = tmp_values[0].sensor.unit;
			x = tmp_values.map((h) => {
				return h.created_on;
			});
			y = tmp_values.map((h) => {
				return h.avg_value;
			});
			y = tmp_values.map((h) => {
				return this.selected_sensor_type != 'RH' && this.selected_sensor_type != 'T'
					? h.avg_value
					: this.selected_sensor_type == 'T'
					? h.avg_value / 10
					: h.avg_value / 10 >= 0 && h.avg_value / 10 <= 100
					? h.avg_value / 10
					: h.avg_value / 100;
			});
		}

		if (this.main_chart) {
			this.main_chart.setOption(
				{
					...this.chart_class.mergedSeriesData(x, y, sensor_unit),
				},
				{
					notMerge: false,
				},
			);
		}
	}

	infoDropdownToggle() {
		let info_dropdown = document ? document.getElementById('info-content-dropdown') : null;
		if (!info_dropdown) return;
		info_dropdown.classList.toggle('show');

		let info_dropdown_shape = document ? document.getElementById('info-content-shape') : null;
		if (!info_dropdown_shape) return;
		info_dropdown_shape.classList.toggle('visible');
	}

	private infoDropdownRemove() {
		let info_dropdown = document ? document.getElementById('info-content-dropdown') : null;
		if (!info_dropdown) return;
		info_dropdown.classList.remove('show');

		let info_dropdown_shape = document ? document.getElementById('info-content-shape') : null;
		if (!info_dropdown_shape) return;
		info_dropdown_shape.classList.remove('visible');
	}
}
