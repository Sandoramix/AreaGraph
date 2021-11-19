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

	sensor_values: string[] = ['CO2', 'T', 'RH', 'PM2.5', 'PM10'];
	private sensor_help_info: string[] = [
		`<b>L’anidride carbonica</b> (CO2) è un gas inodore ed incolore, ed è tra i gas ad effetto serra che maggiormente contribuiscono al riscaldamento del pianeta.
		Tali gas presenti nell’atmosfera terrestre catturano il calore del sole impedendogli di ritornare nello spazio.
		L'incremento globale della concentrazione di CO2 è dovuto all'<b>uso di combustibili fossili</b> e ai <b>cambiamenti nell'utilizzo dei suoli</b>.`,

		`Temperatura media`,

		`<b>Umidita' relativa</b> (RH) è il rapporto tra l'umidità assoluta attuale e l'umidità assoluta massima possibile <em>(che dipende dalla temperatura dell'aria attuale)</em>. 
		Una lettura del 100% di umidità relativa significa che l'aria è totalmente satura di vapore acqueo e non può più trattenere, creando la possibilità di pioggia. `,
		//Ciò <b>non significa</b> che l'umidità relativa debba essere del 100% affinché possa piovere: <b>deve essere del 100% nel punto in cui si stanno formando le nuvole</b>, ma l'umidità relativa vicino al suolo potrebbe essere molto inferiore `,

		`Le polveri fini, denominate <b>PM2.5</b> (diametro inferiore a 2.5 µm), 
		Sono un insieme di particelle solide e liquide con una grande varieta' di caratteristiche fisiche, chimiche, geometriche e morfologiche.
		Le sorgenti possono essere di tipo <b>organica</b> o <b>inorganica</b>`,

		`Le polveri fini, denominate <b>PM10</b> (diametro inferiore a 10 µm), 
		Sono un insieme di particelle solide e liquide con una grande varieta' di caratteristiche fisiche, chimiche, geometriche e morfologiche.
		Le sorgenti possono essere di tipo <b>organica</b> o <b>inorganica</b>`,
	];
	sensor_info: string;
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

		let index = this.sensor_values.indexOf(this.selected_sensor_type);
		this.sensor_info = index == -1 ? '' : this.sensor_help_info[index];
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
				let avg = h.avg_value;
				if (this.selected_sensor_type != 'RH' && this.selected_sensor_type != 'T') {
					return avg;
				}
				if (this.selected_sensor_type == 'T') {
					avg = avg < 60 ? avg : avg >= 600 ? avg / 100 : avg / 10;
					console.log(avg);

					return avg;
				}
				return avg >= 0 && avg <= 100 ? avg : avg <= 1000 ? avg / 10 : avg / 100;
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
