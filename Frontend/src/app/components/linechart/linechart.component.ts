import { StationHourlyAvg } from "src/utils/Station";
import { Component, EventEmitter, Input, OnInit, Output, Renderer2 } from "@angular/core";
import { EChartsOption } from "echarts";
import { Chart_custom } from "src/utils/Chart-class";

@Component({
	selector: "app-linechart",
	templateUrl: "./linechart.component.html",
	styleUrls: ["./linechart.component.css"],
})
export class LinechartComponent implements OnInit {
	@Output() afterLoading: EventEmitter<string> = new EventEmitter();

	private chart_class: Chart_custom = new Chart_custom();

	sensor_values: string[] = ["CO2", "T", "RH", "PM2.5", "PM10"];
	private sensor_help_info: string[] = [
		`<b>L’anidride carbonica</b> (CO2) è un gas inodore ed incolore, ed è tra i gas ad effetto serra che maggiormente contribuiscono al riscaldamento del pianeta.
		Tali gas presenti nell’atmosfera terrestre catturano il calore del sole impedendogli di ritornare nello spazio.
		L'incremento globale della concentrazione di CO2 è dovuto all'<b>uso di combustibili fossili</b> e ai <b>cambiamenti nell'utilizzo dei suoli</b>.`,

		`Temperatura media`,

		`<b>Umidita' relativa</b> (RH) è il rapporto tra l'umidità assoluta attuale e l'umidità assoluta massima possibile <em>(che dipende dalla temperatura dell'aria attuale)</em>. 
		Con 100% di umidità relativa si crea crea la possibilità di pioggia.
		P.s. <b>per poter piovere, deve essere 100% nel punto in cui si stanno formando le nuvole</b>, ma l'umidità relativa vicino al suolo potrebbe essere molto inferiore `,

		`Le polveri fini, denominate <b>PM2.5</b> (diametro inferiore a 2.5 µm), 
		Sono un insieme di particelle solide e liquide con una grande varieta' di caratteristiche fisiche, chimiche, geometriche e morfologiche.
		Le sorgenti possono essere di tipo <b>organico</b> o <b>inorganico</b>`,

		`Le polveri fini, denominate <b>PM10</b> (diametro inferiore a 10 µm), 
		Sono un insieme di particelle solide e liquide con una grande varieta' di caratteristiche fisiche, chimiche, geometriche e morfologiche.
		Le sorgenti possono essere di tipo <b>organico</b> o <b>inorganico</b>`,
	];
	sensor_info: string;
	selected_sensor_type: string = "CO2";

	private main_chart: any;
	chart_options: EChartsOption;

	@Input() data: StationHourlyAvg[] | null = null;
	@Input() enabled: boolean;

	help: string;

	constructor(private renderer: Renderer2) {
		this.renderer.listen("window", "click", (e: Event) => {
			let info: any = e.target;
			let _id: string = info.id;

			let _class: string = info.classList[0];

			if (_class !== "info-content" && _class !== "info-icon" && _id !== "info-content-shape") {
				this.infoDropdownRemove();
			}
		});
	}

	ngOnInit(): void {
		this.main_chart = null;
	}

	chartInit(ev: any) {
		this.main_chart = ev;
	}

	updateHandler(datas?: StationHourlyAvg[]) {
		if (datas) {
			this.data = datas;
			this.selected_sensor_type = "CO2";
			setTimeout(() => {
				this.afterLoading.emit("");
			}, 1000);
		}

		let index = this.sensor_values.indexOf(this.selected_sensor_type);
		this.sensor_info = index == -1 ? "" : this.sensor_help_info[index];
		this.updateChart();
	}

	private updateChart() {
		let current_sensor = this.selected_sensor_type;
		let tmp_values =
			this.data == null
				? []
				: this.data.filter((obj) => {
						return obj.sensor.type == current_sensor;
				  });

		let x: string[] = [];
		let y: number[] = [];
		let sensor_unit: string = "";

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
				if (current_sensor != "RH" && current_sensor != "T") {
					return avg;
				}
				if (current_sensor == "T") {
					avg = avg < 60 ? avg : avg >= 600 ? avg / 100 : avg / 10;

					return avg;
				}
				return avg >= 0 && avg <= 100 ? avg : avg <= 1000 ? avg / 10 : avg / 100;
			});
		}

		let limit: number = -100;
		switch (current_sensor) {
			case "PM2.5": {
				limit = 25;
				break;
			}
			case "PM10": {
				limit = 40;
				break;
			}
			case "CO2": {
				limit = 400;
				break;
			}
			default: {
				limit = -100;
				break;
			}
		}
		if (!this.chart_options) {
			this.chart_options = this.chart_class.newLineChart(x, y, sensor_unit, limit);

			return;
		}
		if (this.main_chart) {
			this.main_chart.setOption(
				{
					...this.chart_class.newLineChart(x, y, sensor_unit, limit),
				},
				{
					notMerge: true,
				}
			);
		}
	}

	infoDropdownToggle() {
		let info_dropdown = document ? document.getElementById("info-content-dropdown") : null;
		if (!info_dropdown) return;
		info_dropdown.classList.toggle("show");

		let info_dropdown_shape = document ? document.getElementById("info-content-shape") : null;
		if (!info_dropdown_shape) return;
		info_dropdown_shape.classList.toggle("visible");
	}

	private infoDropdownRemove() {
		let info_dropdown = document ? document.getElementById("info-content-dropdown") : null;
		if (!info_dropdown) return;
		info_dropdown.classList.remove("show");

		let info_dropdown_shape = document ? document.getElementById("info-content-shape") : null;
		if (!info_dropdown_shape) return;
		info_dropdown_shape.classList.remove("visible");
	}
}
