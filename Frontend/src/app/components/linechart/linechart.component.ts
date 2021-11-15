import { StationHourlyAvg } from 'src/utils/StationHourlyAvg';
import { Component, Input, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { Chart_custom } from 'src/utils/Chart-class';

@Component({
	selector: 'app-linechart',
	templateUrl: './linechart.component.html',
	styleUrls: ['./linechart.component.css'],
})
export class LinechartComponent implements OnInit {
	private chart_class: Chart_custom = new Chart_custom();
	chart_created = false;
	station_values: string[] = ['T', 'RH', 'CO2', 'PM2.5', 'PM10'];
	selected_sensor_type: string = '';

	private main_chart: any;
	chart_options: EChartsOption;

	@Input() data: StationHourlyAvg[];

	ngOnInit(): void {
		this.main_chart = null;
		this.chart_options = this.chart_class.newLineChart();
	}

	chartInit(ev: any) {
		this.main_chart = ev;
	}

	updateChart() {
		let tmp_values = this.data.filter((obj) => {
			return obj.sensor.type == this.selected_sensor_type;
		});

		let x: string[] = [];
		let y: number[] = [];
		let sensor_unit: string = 'N/A';

		if (tmp_values.length > 0) {
			sensor_unit = tmp_values[0].sensor.unit;

			x = tmp_values.map((h) => {
				return h.created_on;
			});
			y = tmp_values.map((h) => {
				return h.avg_value;
			});
			this.chart_created = true;
		}

		this.main_chart.setOption(
			{
				...this.chart_class.mergedXAxis(x),
				...this.chart_class.mergedSeriesData(y, sensor_unit),
			},
			{
				notMerge: false,
			},
		);
	}
}
