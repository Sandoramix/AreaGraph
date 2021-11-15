import { EChartsOption } from 'echarts';

export class Chart_custom {
	private x_type: 'category' | 'log' | 'time' | 'value' = 'category';

	newLineChart(x_vals?: string[], y_vals?: number[], unit?: string): EChartsOption {
		return {
			xAxis: {
				type: this.x_type,
				boundaryGap: false,
				data: x_vals ? x_vals : [],
			},
			yAxis: {
				type: 'value',
			},
			tooltip: {
				trigger: 'item',
				showDelay: 0,
				transitionDuration: 0.2,
				formatter: function (params: any) {
					return `<b>${params['name']}</b> : ${params['value']}${unit ? unit : ''}`;
				},
			},
			series: {
				data: y_vals ? y_vals : [],
				type: 'line',
				areaStyle: {},
			},
		};
	}

	mergedXAxis(x: string[]) {
		return {
			xAxis: {
				type: this.x_type,
				boundaryGap: false,
				data: x,
			},
		};
	}
	mergedSeriesData(y: number[], unit: string) {
		return {
			series: {
				data: y,
				type: 'line',
				areaStyle: {},
			},
			tooltip: {
				trigger: 'item',
				showDelay: 0,
				transitionDuration: 0.2,
				formatter: function (params: any) {
					return `<b>${params['name']}</b> : ${params['value']}${unit}`;
				},
			},
		};
	}
}
