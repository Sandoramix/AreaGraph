import { EChartsOption } from "echarts";

export class Chart_custom {
	private x_type: "category" | "log" | "time" | "value" = "category";
	newLineChart(
		x_vals?: string[],
		y_vals?: number[],
		unit: string = "",
		limit?: number
	): EChartsOption {
		return {
			...this.xAxisPart(x_vals ? x_vals : []),

			...this.yAxisPart(unit, limit ? limit : -1),
			...this.seriesPart(unit, y_vals ? y_vals : [], limit ? limit : -1),
			...this.tooltipPart(unit),
			dataZoom: [
				{
					type: "inside",
					start: 0,
					end: 100,
				},

				{
					start: 0,
					end: 100,
				},
			],
		};
	}

	mergedSeriesData(x: string[], y: number[], unit: string, limit: number) {
		return {
			...this.xAxisPart(x),
			...this.yAxisPart(unit, limit),
			...this.seriesPart(unit, y, limit),
			...this.tooltipPart(unit),
			...this.toolboxPart(unit),
		};
	}

	private tooltipPart(unit: string): EChartsOption {
		return {
			tooltip: {
				trigger: "axis",
				showDelay: 0,
				transitionDuration: 0.2,
				position: function (pos, params, dom, rect, size) {
					return [size.viewSize[0] / 2.25, "1%"];
				},
				formatter: function (params: any) {
					let data = params[0];
					return `<div style="text-align:center;width:15em">
						<b>${data.name}</b>
						<br>
						${data.value} ${unit}
					</div>`;
				},
			},
		};
	}
	private toolboxPart(unit: string): EChartsOption {
		return {
			toolbox: {
				feature: {
					dataView: {
						show: true,
						readOnly: true,
						title: unit == "" ? "" : `Records del sensore [${unit}]`,
					},
					dataZoom: {
						yAxisIndex: "none",
					},
					restore: { show: false },
					saveAsImage: { show: true },
				},
			},
		};
	}

	private xAxisPart(x: string[]): EChartsOption {
		return {
			xAxis: {
				type: this.x_type,
				boundaryGap: ["10%", "10%"],
				data: x,
				name: "Data",
				axisLine: {
					show: true,
				},
			},
		};
	}

	private yAxisPart(unit: string, limit: number): EChartsOption {
		return {
			yAxis: {
				type: "value",
				name: unit,
				nameTextStyle: {
					fontWeight: "bold",
					align: "right",
				},
				position: "left",
				boundaryGap: ["0%", "100%"],
				max: (val) => {
					return unit === "%" ? 100 : Math.floor(val.max) + 1;
				},

				maxInterval: 25,
				minInterval: 1,
			},
		};
	}

	private seriesPart(unit: string, y: number[], limit: number): EChartsOption {
		let markLn = {};
		if (limit != -1) {
			markLn = {
				name: "Limite",
				data: [{ name: "Limite", yAxis: limit }],
				lineStyle: {
					color: "red",
					type: "solid",
					shadowBlur: 2,
				},
			};
		}
		return {
			series: {
				data: y,
				type: "line",
				name: unit,
				areaStyle: {},
				smooth: true,

				markLine: markLn,
			},
		};
	}
}
