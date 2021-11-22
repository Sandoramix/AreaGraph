import { EChartsOption } from 'echarts';

export class Chart_custom {
	private x_type: 'category' | 'log' | 'time' | 'value' = 'category';

	newLineChart(
		x_vals?: string[],
		y_vals?: number[],
		unit: string = ''
	): EChartsOption {
		return {
			...this.xAxisPart(x_vals ? x_vals : []),

			...this.yAxisPart(unit),
			...this.seriesPart(y_vals ? y_vals : []),
			...this.tooltipPart(unit),
			toolbox: {
				feature: {
					dataZoom: {
						yAxisIndex: 'none',
					},
					restore: {},
					saveAsImage: {},
				},
			},
			dataZoom: [
				{
					type: 'inside',
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

	mergedSeriesData(x: string[], y: number[], unit: string) {
		return {
			...this.xAxisPart(x),
			...this.yAxisPart(unit),
			...this.seriesPart(y),
			...this.tooltipPart(unit),
		};
	}

	private tooltipPart(unit: string): EChartsOption {
		return {
			tooltip: {
				trigger: 'axis',
				showDelay: 0,
				transitionDuration: 0.2,
				position: function (pos, params, dom, rect, size) {
					return [
						size.viewSize[0] - pos[0] > size.viewSize[0] * 0.4
							? pos[0]
							: '60%',
						'10%',
					];
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

	private seriesPart(y: number[]): EChartsOption {
		return {
			series: {
				data: y,
				type: 'line',

				areaStyle: {},
				smooth: true,
			},
		};
	}
	private xAxisPart(x: string[]): EChartsOption {
		return {
			xAxis: {
				type: this.x_type,
				boundaryGap: ['10%', '10%'],
				data: x,

				axisLine: {
					show: true,
				},
			},
		};
	}

	private yAxisPart(unit: string): EChartsOption {
		return {
			yAxis: {
				type: 'value',
				name: unit,
				nameTextStyle: {
					fontWeight: 'bold',
					align: 'right',
				},

				boundaryGap: ['0%', '100%'],
				max: (val) => {
					return unit === '%' ? 100 : Math.round(val.max);
				},
				maxInterval: 50,
			},
		};
	}
}
